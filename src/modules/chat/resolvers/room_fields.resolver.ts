import { RoomMember } from './../entities/room_member.entity';
import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Room, RoomRedis } from '../entities/room.entity';
import { RoomService } from '../services/room.service';
import { MessageService } from '../services/message.service';
import { Message } from '../entities/message.entity';
import { CurrentUser } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/users.entity';
import { getUserFromContextConnection, ADMIN_ID_CHAT } from 'src/helpers/constants';
import { RoomTypeEnum } from 'src/graphql/enums/room_type';
import { RoleEnum } from 'src/graphql/enums/roles';

@Resolver(() => Room)
export class RoomsFieldsResolver {
    constructor(private readonly roomService: RoomService, private readonly messageService: MessageService) {}

    @ResolveField(() => [RoomMember], {
        nullable: false,
        defaultValue: [],
    })
    async members(@Parent() room: Room) {
        return this.roomService.getMemberOfRoom(room.id);
    }

    @ResolveField(() => Message, {
        nullable: true,
        defaultValue: {},
    })
    async message(@Parent() room: Room) {
        return this.messageService.getLastMessage(room.id);
    }

    @ResolveField(() => Number, {
        nullable: false,
        defaultValue: 0,
    })
    async unread(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        const userValidate = userConnection?.id ? userConnection : currentUser;
        let userId;
        if (userValidate?.roles?.includes(RoleEnum.ADMIN) || userValidate?.roles?.includes(RoleEnum.SUPER_ADMIN)) {
            userId = ADMIN_ID_CHAT;
        } else {
            userId = userValidate?.id;
        }
        return this.messageService.countUserNotSeen(room.id, userId);
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: true,
    })
    async notification(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        return this.messageService.getStatusNotification(
            room.id,
            userConnection?.id ? userConnection?.id : currentUser.id,
        );
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: true,
    })
    async canSendMessage(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        return this.messageService.getStatusNotification(
            room.id,
            userConnection?.id ? userConnection?.id : currentUser.id,
        );
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: false,
    })
    async hasBeenBlocked(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        if (room.roomType === RoomTypeEnum.PRIVATE) {
            const userConnection = getUserFromContextConnection(context);
            return this.messageService.checkBlockForUser(userConnection?.id ? userConnection?.id : currentUser.id);
        }
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: false,
    })
    async blocked(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        if (room.roomType === RoomTypeEnum.PRIVATE) {
            const userConnection = getUserFromContextConnection(context);
            return this.messageService.checkBlockByUser(userConnection?.id ? userConnection?.id : currentUser.id);
        }
    }
}

@Resolver(() => RoomRedis)
export class RoomRedisFieldsResolver {
    constructor(private readonly roomService: RoomService, private readonly messageService: MessageService) {}

    @ResolveField(() => [RoomMember], {
        nullable: false,
        defaultValue: [],
    })
    async members(@Parent() room: Room) {
        return this.roomService.getMemberOfRoom(room.id);
    }

    @ResolveField(() => Message, {
        nullable: true,
        defaultValue: {},
    })
    async message(@Parent() room: Room) {
        return this.messageService.getLastMessage(room.id);
    }

    @ResolveField(() => Number, {
        nullable: false,
        defaultValue: 0,
    })
    async unread(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        const userValidate = userConnection?.id ? userConnection : currentUser;
        let userId;
        if (userValidate?.roles?.includes(RoleEnum.ADMIN) || userValidate?.roles?.includes(RoleEnum.SUPER_ADMIN)) {
            userId = ADMIN_ID_CHAT;
        } else {
            userId = userValidate?.id;
        }
        return this.messageService.countUserNotSeen(room.id, userId);
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: true,
    })
    async notification(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        return this.messageService.getStatusNotification(
            room.id,
            userConnection?.id ? userConnection?.id : currentUser.id,
        );
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: true,
    })
    async canSendMessage(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        const userConnection = getUserFromContextConnection(context);
        return this.messageService.getStatusNotification(
            room.id,
            userConnection?.id ? userConnection?.id : currentUser.id,
        );
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: false,
    })
    async hasBeenBlocked(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        if (room.roomType === RoomTypeEnum.PRIVATE) {
            const userConnection = getUserFromContextConnection(context);
            return this.messageService.checkBlockForUser(userConnection?.id ? userConnection?.id : currentUser.id);
        }
    }

    @ResolveField(() => Boolean, {
        nullable: false,
        defaultValue: false,
    })
    async blocked(@Parent() room: Room, @CurrentUser() currentUser: User, @Context() context: any) {
        if (room.roomType === RoomTypeEnum.PRIVATE) {
            const userConnection = getUserFromContextConnection(context);
            return this.messageService.checkBlockByUser(userConnection?.id ? userConnection?.id : currentUser.id);
        }
    }
}
