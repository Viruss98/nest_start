import { Injectable, NotFoundException } from '@nestjs/common';
import { ApolloError, ForbiddenError } from 'apollo-server';
import { RoomMemberTypeEnum, RoomTypeEnum, ActionMemberTypeEnum } from 'src/graphql/enums/room_type';
import { UsersService } from 'src/modules/users/services/users.service';
import { getConnection, Not, Equal } from 'typeorm';
import { RoomDataLoader } from '../dataloaders/room.dataloader';
import { CheckRoomInput, CreateRoomInput, AdminCreateRoomInput, AdminAddMemberInput } from '../dto/create_room.input';
import { GetRoomInput } from '../dto/room';
import { RoomMember } from '../entities/room_member.entity';
import { MessageBlocksRepository } from '../repositories/message_block.repository';
import { RoomRepository } from '../repositories/room.repository';
import { Room } from './../entities/room.entity';
import { RoomMemberRepository } from './../repositories/room_member.repository';
import { ADMIN_ID_CHAT } from 'src/helpers/constants';
import { User } from 'src/modules/users/entities/users.entity';
import { RoleEnum } from 'src/graphql/enums/roles';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NofificationTypeEnum } from 'src/graphql/enums/notification';

@Injectable()
export class RoomService {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly usersService: UsersService,
        private readonly roomMemberRepository: RoomMemberRepository,
        private readonly messageBlocksRepository: MessageBlocksRepository,
        private readonly roomDataLoader: RoomDataLoader,
        private readonly notificationService: NotificationService,
    ) {}
    async createRoom(input: CreateRoomInput, userId: string) {
        const { roomType, userIds, roomName, image } = input;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (roomType !== RoomTypeEnum.PRIVATE && roomType !== RoomTypeEnum.PRIVATE_WITH_ADMIN) {
            if (!roomName) {
                throw new ApolloError('The name cannot be empty');
            }
        }
        if (input.roomType !== RoomTypeEnum.PUBLISH) {
            if (!userIds.length || userIds.length < 2) {
                throw new ApolloError('The number of members must be greater than 2');
            }
        }

        try {
            let newRoom: Room;
            if (roomType === RoomTypeEnum.PRIVATE) {
                newRoom = new Room({
                    roomType,
                    image,
                    createBy: userId,
                    createFor: userIds[0] !== userId ? userIds[0] : userIds[1],
                });
            } else if (roomType === RoomTypeEnum.PRIVATE_WITH_ADMIN) {
                newRoom = new Room({
                    roomType,
                    roomName,
                    image,
                    createBy: userId,
                    createFor: userIds[0] !== userId ? userIds[0] : userIds[1],
                });
            } else {
                newRoom = new Room({
                    roomType,
                    roomName,
                    image,
                    createBy: userId,
                });
            }

            const newRoomCrate = this.roomRepository.create(newRoom);
            if (input.roomType !== RoomTypeEnum.PUBLISH) {
                await this.createRoomMember(queryRunner, newRoomCrate.id, userId, userIds);
            }
            await queryRunner.manager.save(newRoomCrate);
            await queryRunner.commitTransaction();
            return newRoomCrate;
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    async adminCreateRoom(input: AdminCreateRoomInput) {
        const { userIds, roomName } = input;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (!roomName) {
            throw new ApolloError('The name cannot be empty');
        }
        if (!userIds.length || userIds.length < 1) {
            throw new ApolloError('The number of members must be greater than 1');
        }
        try {
            const newRoom = new Room({
                roomType: RoomTypeEnum.GROUP,
                createBy: ADMIN_ID_CHAT,
                roomName: input.roomName,
            });

            const newRoomCrate = this.roomRepository.create(newRoom);
            await this.createRoomMember(queryRunner, newRoomCrate.id, ADMIN_ID_CHAT, [...userIds, ADMIN_ID_CHAT]);
            await queryRunner.manager.save(newRoomCrate);
            await queryRunner.commitTransaction();
            return newRoomCrate;
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    async adminAddMember(input: AdminAddMemberInput) {
        const { roomId, userId, type } = input;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const userInfo = await this.usersService.findById(userId);
            if (userInfo) {
                const { isMember, userMember } = await this.checkMemberOfRoom(roomId, userInfo, false);
                console.log('isMember', isMember);
                if (isMember && type === ActionMemberTypeEnum.ADD) {
                    throw new ApolloError('User exist in room');
                }
                if (!isMember && type === ActionMemberTypeEnum.REMOVE) {
                    throw new ApolloError('User not exist in room');
                }

                if (isMember && userMember?.id) {
                    await queryRunner.manager.remove(RoomMember, userMember);
                }

                if (!isMember) {
                    const newMember = {
                        userId,
                        role: RoomMemberTypeEnum.MEMBER,
                        roomId,
                    };
                    const roomMemberCreate = this.roomMemberRepository.create(newMember);
                    await queryRunner.manager.save(roomMemberCreate);
                }
            }
            const roomInfo = await this.getRoomInfo(roomId);
            return { room: roomInfo, userInfo };
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    async checkRoomPublish(userId: string) {
        const result = await this.roomRepository.findOne({
            where: {
                roomType: RoomTypeEnum.PUBLISH,
            },
        });
        if (result) {
            return result;
        }
        const inputCreateRoom: CreateRoomInput = {
            roomType: RoomTypeEnum.PUBLISH,
            roomName: 'ONDA알림톡',
            userIds: [],
        };
        return this.createRoom(inputCreateRoom, userId);
    }
    async createRoomWithAdmin(input: CreateRoomInput, userId: string) {
        const { roomType, userIds, roomName, image } = input;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        if (!userIds.length || userIds.length < 2) {
            throw new ApolloError('Số thành viên trong phòng phải lớn hơn 2');
        }
        try {
            const newRoom = new Room({
                roomType,
                roomName,
                image,
                createBy: userId,
            });

            const newRoomCrate = this.roomRepository.create(newRoom);
            await this.createRoomMember(queryRunner, newRoomCrate.id, userId, userIds);
            await this.notificationService.create({
                navigationItemId: newRoomCrate.id,
                type: NofificationTypeEnum.NEW_CHAT_INVITED,
                buyerId: userId,
                sellerId: userId,
                messageRoomName: newRoomCrate.roomName,
            });
            await queryRunner.manager.save(newRoomCrate);
            await queryRunner.commitTransaction();
            return newRoomCrate;
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    createRoomMember = async (queryRunner, roomId: string, userCreateId: string, userIds: string[]) => {
        if (userIds && userIds.length) {
            const roomMember = userIds.map((m) => ({
                userId: m,
                roomId,
                role: m === userCreateId ? RoomMemberTypeEnum.ADMIN : RoomMemberTypeEnum.MEMBER,
            }));
            const roomMemberCreate = this.roomMemberRepository.create(roomMember);
            return await queryRunner.manager.save(roomMemberCreate);
        }
    };

    async checkRoom(input: CheckRoomInput, userId: string) {
        const aliasRoom = 'rooms';
        const queryBuilder = this.roomRepository
            .createQueryBuilder(aliasRoom)
            .where(`${aliasRoom}."room_type" = '${[RoomTypeEnum.PRIVATE]}'`)
            .andWhere(`${aliasRoom}."create_by" = (${[userId]}) AND ${aliasRoom}."create_for" = (${[input.userId]})`)
            .orWhere(`${aliasRoom}."create_for" = (${[userId]}) AND ${aliasRoom}."create_by" = (${[input.userId]})`);
        const result = await queryBuilder.getOne();
        if (result && result?.id) {
            return result;
        }
        const inputCreateRoom: CreateRoomInput = {
            roomType: RoomTypeEnum.PRIVATE,
            userIds: [userId, input.userId],
        };
        return this.createRoom(inputCreateRoom, userId);
    }

    async checkRoomWithAdmin(userId: string) {
        const aliasRoom = 'rooms';
        const queryBuilder = this.roomRepository
            .createQueryBuilder(aliasRoom)
            .where(`${aliasRoom}."room_type" = '${[RoomTypeEnum.PRIVATE_WITH_ADMIN]}'`)
            .andWhere(`${aliasRoom}."create_by" = (${[userId]}) AND ${aliasRoom}."create_for" = (${[ADMIN_ID_CHAT]})`)
            .orWhere(`${aliasRoom}."create_for" = (${[userId]}) AND ${aliasRoom}."create_by" = (${[ADMIN_ID_CHAT]})`);
        const result = await queryBuilder.getOne();
        if (result && result?.id) {
            return { room: result, isNew: false };
        }
        const inputCreateRoom: CreateRoomInput = {
            roomType: RoomTypeEnum.PRIVATE_WITH_ADMIN,
            userIds: [userId, ADMIN_ID_CHAT],
        };
        const newRoom = await this.createRoom(inputCreateRoom, userId);
        return { room: newRoom, isNew: true };
    }

    async room(roomId: string, user: User) {
        const roomInfo = await this.roomRepository.findOne({
            where: {
                id: roomId,
            },
        });
        if (!roomInfo) {
            throw new NotFoundException('Room Not Found');
        }
        await this.checkMemberOfRoom(roomId, user, true, roomInfo);
        return roomInfo;
    }

    async checkMemberOfRoom(roomId: string, user: User, needThrow = true, roomInfo?: Room) {
        const roomMembers = await this.roomMemberRepository.find({
            where: {
                roomId,
                isMember: true,
            },
        });
        let isMember = false;
        let userMember: RoomMember | null = null;
        if (user.roles.includes(RoleEnum.ADMIN) || user.roles.includes(RoleEnum.SUPER_ADMIN)) {
            isMember = true;
        } else if (roomInfo?.roomType === RoomTypeEnum.PUBLISH) {
            isMember = true;
        } else {
            for (const member of roomMembers) {
                if (member.userId === user.id) {
                    isMember = true;
                    userMember = member;
                    break;
                }
            }
        }

        if (!isMember && needThrow) {
            throw new ForbiddenError('Your are not member of room');
        }

        return {
            isMember,
            userMember: userMember,
            countMembers: roomMembers.length,
            members: roomMembers?.map((member) => member.userId),
        };
    }
    async rooms(input: GetRoomInput, userId: string) {
        const { limit = 15, page = 1, keyword = '' } = input;
        const aliasRoom = 'rooms';
        let queryBuilder = this.roomRepository
            .createQueryBuilder(aliasRoom)
            .orderBy(`${aliasRoom}.lastUpdated`, 'DESC');
        queryBuilder.leftJoin(
            RoomMember,
            'member',
            `member."room_id" = ${aliasRoom}."id" AND member."user_id" = '${userId}'`,
        );
        queryBuilder.where(`"is_delete" = false`);
        queryBuilder.andWhere(
            `("room_type" = '${RoomTypeEnum.PUBLISH}' OR (member."is_leave" = false AND member."is_member" = true))`,
        );
        if (keyword) {
            queryBuilder = queryBuilder.andWhere(`(LOWER("room_name") LIKE '%${keyword.trim().toLowerCase()}%')`);
        }

        return this.roomRepository.parsePaginate(queryBuilder, { limit, page });
    }

    async adminRooms(input: GetRoomInput, userId: string) {
        const { limit = 15, page = 1, keyword = '' } = input;
        const aliasRoom = 'rooms';
        let queryBuilder = this.roomRepository
            .createQueryBuilder(aliasRoom)
            .orderBy(`${aliasRoom}.lastUpdated`, 'DESC');
        // queryBuilder.innerJoin(
        //     RoomMember,
        //     'member',
        //     `member."room_id" = ${aliasRoom}."id" AND member."user_id" = '${userId}' AND member."is_leave" = false AND member."is_member" = true`,
        // );
        queryBuilder.where(`"is_delete" = false`);
        queryBuilder.andWhere(
            `"room_type" = '${RoomTypeEnum.PRIVATE_WITH_ADMIN}' OR "room_type" = '${RoomTypeEnum.GROUP}'`,
        );
        if (keyword) {
            queryBuilder = queryBuilder.andWhere(`(LOWER("room_name") LIKE '%${keyword.trim().toLowerCase()}%')`);
        }

        return this.roomRepository.parsePaginate(queryBuilder, { limit, page });
    }
    async updateAtRoom(roomId: string) {
        await this.roomRepository.update(roomId, { lastUpdated: new Date() });
        return this.roomDataLoader.clear(roomId).load(roomId);
    }

    async getRoomMemberOfUser(userId: string) {
        return await this.roomMemberRepository.find({
            where: {
                userId,
            },
        });
    }

    async getMemberOfRoom(roomId: string) {
        return await this.roomMemberRepository.find({
            where: {
                roomId,
            },
        });
    }

    async getMemberOfRoomNotEqualUser(roomId: string, userId?: string) {
        return await this.roomMemberRepository.find({
            where: {
                roomId,
                userId: Not(Equal(userId)),
            },
        });
    }

    async getRoomInfo(roomId: string) {
        return this.roomDataLoader.load(roomId);
    }

    async leaveOrJoinRoom(roomId: string, userId: string) {
        const roomMember = await this.getLeaveStatus(roomId, userId);

        await this.roomMemberRepository.update({ id: roomMember.id }, { isLeave: !roomMember.isLeave });
        return !roomMember.isLeave;
    }

    async joinRoomPrivate(roomId: string, userId: string) {
        const roomMember = await this.getLeaveStatus(roomId, userId);

        await this.roomMemberRepository.update({ id: roomMember.id }, { isLeave: false });
        return !roomMember.isLeave;
    }

    async getLeaveStatus(roomId: string, userId: string) {
        const roomMember = await this.roomMemberRepository.findOne({
            where: {
                roomId,
                userId,
            },
        });

        if (!roomMember) {
            throw new NotFoundException('Room not found');
        }

        return roomMember;
    }
}
