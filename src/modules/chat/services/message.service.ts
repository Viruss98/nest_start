import { Message } from './../entities/message.entity';
import { Injectable } from '@nestjs/common';
import {
    GetMessagesInput,
    NewMessagesInput,
    NewNoticeMessagesInput,
    GetNoticesInput,
    GetMessageBlocksInput,
} from '../dto/message';
import { MessageRepository } from '../repositories/message.repository';
import { getConnection } from 'typeorm';
import { ApolloError } from 'apollo-server';
import { RoomService } from './room.service';
import { MediaService } from 'src/modules/media/services/media.service';
import { MessageNotice } from '../entities/message_notice.entity';
import { ADMIN_ID_CHAT } from 'src/helpers/constants';
import { MessageTypeEnum } from 'src/graphql/enums/message_type';
import { MessageNoticesRepository } from '../repositories/message_notice.repository';
// import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NofificationTypeEnum } from 'src/graphql/enums/notification';

@Injectable()
export class MessageService {
    constructor(
        private readonly messageRepository: MessageRepository,
        private readonly messageNoticesRepository: MessageNoticesRepository,
        private readonly roomService: RoomService,
        private readonly mediaService: MediaService,
        // private readonly notificationService: NotificationService,
    ) {}

    async messages(input: GetMessagesInput, userId: string) {
        const { limit = 15, page = 1, roomId } = input;
        const aliasRoom = 'message';
        const queryBuilder = this.messageRepository.createQueryBuilder(aliasRoom);
        queryBuilder.andWhere(`"room_id" = '${roomId}'`);
        queryBuilder.orderBy('"created_at"', 'DESC');
        // return this.messageRepository.parsePaginate(queryBuilder, { limit, page });
    }

    async notices(input: GetNoticesInput) {
        const { limit = 15, page = 1 } = input;
        const aliasRoom = 'notices';
        const queryBuilder = this.messageNoticesRepository.createQueryBuilder(aliasRoom);
        queryBuilder.orderBy('"created_at"', 'DESC');
        // return this.messageRepository.parsePaginate(queryBuilder, { limit, page });
    }

    async blockOrUnBlockUser(userId: string, currentUserId: string) {
        // const checkBlocks = await this.messageBlocksRepository.findOne({
        //     where: {
        //         userId: currentUserId,
        //         blockId: userId,
        //     },
        // });
        // if (checkBlocks) {
        //     await this.messageBlocksRepository.delete(checkBlocks.id);
        //     return false;
        // } else {
        //     await this.messageBlocksRepository.save(
        //         new MessageBlocks({
        //             userId: currentUserId,
        //             blockId: userId,
        //         }),
        //     );
        // }
        return true;
    }

    async getListMessageBlocks(input: GetMessageBlocksInput, userId: string) {
        // const { limit = 15, page = 1 } = input;
        // const aliasRoom = 'message_blocks';
        // const queryBuilder = this.messageBlocksRepository.createQueryBuilder(aliasRoom);
        // queryBuilder.andWhere(`"user_id" = '${userId}'`);
        // queryBuilder.orderBy('"created_at"', 'DESC');
        // return this.messageRepository.parsePaginate(queryBuilder, { limit, page });
    }

    async sendMessage(input: NewMessagesInput, userId: string) {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newMessage = new Message({ userId, ...input, messageType: input.type });
            const newMessageCreate = this.messageRepository.create(newMessage);
            this.createMessageSeen(newMessage.id, input.roomId, userId);
            // await this.notificationService.create({
            //     navigationItemId: newMessageCreate.roomId,
            //     type: NofificationTypeEnum.NEW_CHAT_MESSAGE,
            //     buyerId: userId,
            //     sellerId: userId,
            //     messageSender: '',
            // });
            await queryRunner.manager.save(newMessageCreate);
            await queryRunner.commitTransaction();
            return newMessageCreate;
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    async sendMessageNotice(input: NewNoticeMessagesInput, roomId: string) {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const newMessage = new Message({
                userId: ADMIN_ID_CHAT,
                roomId,
                messageType: MessageTypeEnum.CUSTOM,
            });

            const newNotice = new MessageNotice({ ...input, messageId: newMessage.id });

            const newMessageCreate = this.messageRepository.create(newMessage);
            const newNoticeCreate = this.messageNoticesRepository.create(newNotice);
            await queryRunner.manager.save(newMessageCreate);
            await queryRunner.manager.save(newNoticeCreate);
            await queryRunner.commitTransaction();
            return newMessageCreate;
        } catch (error) {
            console.log(JSON.stringify(error));
            await queryRunner.rollbackTransaction();
            throw new ApolloError(error || 'save_unsuccessfully');
        } finally {
            await queryRunner.release();
        }
    }

    async getNoticeDetail(messageId: string) {
        return this.messageNoticesRepository.findOne({
            where: {
                messageId: messageId,
            },
        });
    }

    async createMessageSeen(messageId: string, roomId: string, userId: string) {
        const listMembers = await this.roomService.getMemberOfRoom(roomId);
        const listMessageSeen = listMembers.map((m) => ({
            userId: m.userId,
            roomId,
            messageId,
            isSeen: m.userId === userId ? true : false,
        }));
        // const listSeen = this.messageSeenRepository.create(listMessageSeen);
        // this.messageSeenRepository.save(listSeen);
    }

    async getLastMessage(roomId: string) {
        const aliasRoom = 'message';
        const queryBuilder = this.messageRepository.createQueryBuilder(aliasRoom);
        queryBuilder.andWhere(`"room_id" = '${roomId}'`);
        queryBuilder.orderBy(`"created_at"`, 'DESC');
        return queryBuilder.getOne();
    }

    async getMessageParent(messageId: string) {
        const aliasRoom = 'message';
        const queryBuilder = this.messageRepository.createQueryBuilder(aliasRoom);
        queryBuilder.andWhere(`"parent_id" = '${messageId}'`);

        return queryBuilder.getOne();
    }

    async countUserNotSeen(roomId: string, userId: string) {
        // return this.messageSeenRepository.count({
        //     where: {
        //         roomId,
        //         userId,
        //         isSeen: false,
        //     },
        // });
    }

    async getStatusNotification(roomId: string, userId: string) {
        // const response = await this.messageSettingsRepository.findOne({
        //     where: {
        //         roomId,
        //         userId,
        //     },
        // });
        // if (!response?.id) {
        //     await this.messageSettingsRepository.save(
        //         new MessageSettings({
        //             userId,
        //             roomId,
        //             notification: true,
        //         }),
        //     );
        //     return true;
        // }
        // return response.notification;
    }
    // Kiểm tra room Id, lấy thông tin id của 2 user và check xem user đang request bị user kia block không.
    async checkBlockForUser(userId: string) {
        // const blocks = await this.getUserHasBeenBlock(userId);
        // const checkBlocks = blocks.find((block) => block.blockId === userId);
        // return !!checkBlocks;
    }

    async checkBlockByUser(userId: string) {
        // const blocks = await this.getUserBlocked(userId);
        // const checkBlocks = blocks.find((block) => block.userId === userId);
        // return !!checkBlocks;
    }
    async getUserHasBeenBlock(userId: string): Promise<[]> {
        // const users = await this.messageBlocksRepository.find({
        //     where: {
        //         blockId: userId,
        //     },
        // });

        // return users;
    }

    async getUserBlocked(userId: string): Promise<[]> {
        // const users = await this.messageBlocksRepository.find({
        //     where: {
        //         userId: userId,
        //     },
        // });

        // return users;
    }

    async updateSeenByRoomAndUser(roomId: string, userId: string) {
        const result = await getConnection()
            .createQueryBuilder()
            .update(MessageSeen)
            .set({ isSeen: true, seenAt: new Date() })
            .where('"room_id" = :roomId and "user_id" = :userId', {
                roomId,
                userId,
            })
            .execute();

        return !!result;
    }

    async getMediaMessage(mediaId: string) {
        // const queryBuilder = this.messageRepository
        //     .createQueryBuilder('message')
        //     .innerJoin(MediaEntity, 'media', 'message.media_id = media.id')
        //     .where('message.id = :messageId', { messageId })
        //     .select('message.id', 'id')
        //     .addSelect('message.media_id', 'mediaId')
        //     .addSelect('message.message_type', 'messageType')
        //     .addSelect('media.file_name', 'imageName')
        //     .addSelect('media.file_path', 'filePath')
        //     .orderBy('message.id', 'ASC');
        // return await queryBuilder.getOne();

        return this.mediaService.findById(mediaId);
    }
}
