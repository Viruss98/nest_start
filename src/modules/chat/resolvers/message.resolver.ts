import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSubEngine } from 'graphql-subscriptions';
import { AdminAuth, AppAuth, AppSubAuth, CurrentUser } from 'src/decorators/common.decorator';
import { RoleEnum } from 'src/graphql/enums/roles';
import { ADMIN_ID_CHAT, getUserFromContextConnection } from 'src/helpers/constants';
import { User } from 'src/modules/users/entities/users.entity';
import { CheckRoomInput, AdminCreateRoomInput, AdminAddMemberInput } from '../dto/create_room.input';
import {
  GetMessagesInput,
  NewMessagesInput,
  SeenMessagesInput,
  TypingMessagesInput,
  NewNoticeMessagesInput,
  GetNoticesInput,
  GetMessageBlocksInput,
} from '../dto/message';
import { Message, MessageConnection, MessageRedis, TypingConnection } from '../entities/message.entity';
import { Room, RoomRedis } from '../entities/room.entity';
import { MessageService } from '../services/message.service';
import { RoomService } from '../services/room.service';
import { MessageTypeEnum } from 'src/graphql/enums/message_type';
import { ActionMemberTypeEnum } from 'src/graphql/enums/room_type';
import { MessageNoticeConnection } from '../entities/message_notice.entity';

const NEW_MESSAGE = 'NEW_MESSAGE';
const UPDATE_TYPEPING = 'UPDATE_TYPEPING';
const UPDATE_TYPEPING_LIST = 'UPDATE_TYPEPING_LIST';
const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';
const UPDATE_ROOM = 'UPDATE_ROOM';
const LEAVE_ROOM = 'LEAVE_ROOM';
const JOIN_ROOM = 'JOIN_ROOM';
type PayloadUpdateRoomList = {
  updateRoomList: RoomRedis;
  members: string[];
  type: string;
  senderId: string;
};
@Resolver(() => Message)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly roomService: RoomService,
    @Inject('PUB_SUB') private pubSub: PubSubEngine,
  ) { }

  @Mutation(() => Room, { nullable: true, defaultValue: false })
  @AdminAuth()
  async adminCreateRoom(@CurrentUser() user: User, @Args('input') input: AdminCreateRoomInput) {
    const room = await this.roomService.adminCreateRoom(input);

    const newMessageSystem: NewMessagesInput = {
      content: '관리자가 톡방을 만들었습니다.',
      roomId: room.id,
      type: MessageTypeEnum.SYSTEM,
    };
    await this.messageService.sendMessage(newMessageSystem, ADMIN_ID_CHAT);
    return Promise.all([
      await this.roomService.updateAtRoom(room.id),
      await this.roomService.getMemberOfRoom(room.id),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'send',
        senderId: ADMIN_ID_CHAT,
      });
      return room;
    });
  }

  @Mutation(() => Room, { nullable: true, defaultValue: false })
  @AdminAuth()
  async adminAddMember(@Args('input') input: AdminAddMemberInput) {
    const { room, userInfo } = await this.roomService.adminAddMember(input);

    const newMessageSystem: NewMessagesInput = {
      content:
        input.type === ActionMemberTypeEnum.ADD
          ? `관리자가 ${userInfo?.username} 님을 톡방에 초대했습니다. `
          : `관리자가 ${userInfo?.username} 님을 톡방에서 제외했습니다. `,
      roomId: room.id,
      type: MessageTypeEnum.SYSTEM,
    };

    const message = await this.messageService.sendMessage(newMessageSystem, ADMIN_ID_CHAT);

    this.pubSub.publish(NEW_MESSAGE, { newMessage: message });
    return Promise.all([
      await this.roomService.updateAtRoom(room.id),
      await this.roomService.getMemberOfRoom(room.id),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'send',
        senderId: ADMIN_ID_CHAT,
      });
      return room;
    });
  }

  @Mutation(() => Room, { nullable: true, defaultValue: false })
  @AppAuth()
  async checkRoomWithAdmin(@CurrentUser() user: User) {
    const { room, isNew } = await this.roomService.checkRoomWithAdmin(user?.id);
    if (isNew) {
      const membersOfRoom = await this.roomService.getMemberOfRoom(room.id);
      const memberIds = membersOfRoom.map((member) => member.userId);
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: room,
        members: memberIds,
      });
    }

    return room;
  }

  @Mutation(() => Boolean)
  @AppAuth()
  async blockUser(@Args('userId') userId: string, @CurrentUser() user: User) {
    const result = await this.messageService.blockOrUnBlockUser(userId, user?.id);
    const inputCheckRoom: CheckRoomInput = {
      userId,
    };
    const roomInfo = await this.roomService.checkRoom(inputCheckRoom, user?.id);
    const membersOfRoom = await this.roomService.getMemberOfRoom(roomInfo.id);
    const memberIds = membersOfRoom.map((member) => member.userId);
    if (roomInfo) {
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: memberIds,
      });
      this.pubSub.publish(UPDATE_ROOM, {
        updateRoomInfo: roomInfo,
        members: memberIds,
      });
    }
    return result;
  }

  // @Query(() => MessageBlockConnection)
  // @AppAuth()
  // async messageBlocks(@Args('input') input: GetMessageBlocksInput, @CurrentUser() user: User) {
  //   return this.messageService.getListMessageBlocks(input, user.id);
  // }

  @Query(() => MessageConnection, { nullable: false })
  @AppAuth()
  messages(@Args('input') input: GetMessagesInput, @CurrentUser() user: User) {
    return this.messageService.messages(input, user?.id);
  }

  @Query(() => MessageNoticeConnection, { nullable: false })
  @AdminAuth()
  notices(@Args('input') input: GetNoticesInput) {
    return this.messageService.notices(input);
  }

  @Query(() => MessageConnection, { nullable: false })
  @AdminAuth()
  adminMessages(@Args('input') input: GetMessagesInput, @CurrentUser() user: User) {
    return this.messageService.messages(input, user?.id);
  }

  @Mutation(() => Boolean, { nullable: false })
  @AppAuth()
  async leaveRoom(@Args('roomId') roomId: string, @CurrentUser() user: User) {
    const result = await this.roomService.leaveOrJoinRoom(roomId, user?.id);
    const roomInfo = await this.roomService.getRoomInfo(roomId);
    if (result) {
      this.pubSub.publish(LEAVE_ROOM, { userLeaveRoom: roomInfo, userId: user.id });
    } else {
      this.pubSub.publish(JOIN_ROOM, { userJoinRoom: roomInfo, userId: user.id });
    }
    return result;
  }

  @Mutation(() => Boolean, { nullable: false })
  @AppAuth()
  async seenMessages(@Args('input') input: SeenMessagesInput, @CurrentUser() user: User) {
    const result = await this.messageService.updateSeenByRoomAndUser(input.roomId, user?.id);
    return Promise.all([
      await this.roomService.getRoomInfo(input.roomId),
      await this.roomService.getMemberOfRoom(input.roomId),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'seen',
        senderId: user.id,
      });
      return result;
    });
  }

  @Mutation(() => Boolean, { nullable: false })
  @AdminAuth()
  async adminSeenMessages(@Args('input') input: SeenMessagesInput, @CurrentUser() user: User) {
    const result = await this.messageService.updateSeenByRoomAndUser(input.roomId, ADMIN_ID_CHAT);
    return Promise.all([
      await this.roomService.getRoomInfo(input.roomId),
      await this.roomService.getMemberOfRoom(input.roomId),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'seen',
        senderId: user.id,
      });
      return result;
    });
  }

  @Mutation(() => Message, { nullable: false })
  @AppAuth()
  async sendMessage(@Args('input') input: NewMessagesInput, @CurrentUser() user: User) {
    const message = await this.messageService.sendMessage(input, user?.id);
    this.pubSub.publish(NEW_MESSAGE, { newMessage: message });

    return Promise.all([
      await this.roomService.updateAtRoom(input.roomId),
      await this.roomService.getMemberOfRoom(input.roomId),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'send',
        senderId: user?.id,
      });
      this.joinUserPrivateRoom(input.roomId, user?.id);
      console.log(message);
      return message;
    });
  }

  @Mutation(() => Message, { nullable: false })
  @AdminAuth()
  async adminSendMessage(@Args('input') input: NewMessagesInput) {
    const message = await this.messageService.sendMessage(input, ADMIN_ID_CHAT);
    this.pubSub.publish(NEW_MESSAGE, { newMessage: message });

    return Promise.all([
      await this.roomService.updateAtRoom(input.roomId),
      await this.roomService.getMemberOfRoom(input.roomId),
    ]).then((values) => {
      const roomInfo = values[0];
      const membersOfRoom = values[1];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        members: membersOfRoom.map((member) => member.userId),
        type: 'send',
        senderId: ADMIN_ID_CHAT,
      });
      this.joinUserPrivateRoom(input.roomId, ADMIN_ID_CHAT);
      return message;
    });
  }

  @Mutation(() => Message, { nullable: false })
  @AdminAuth()
  async adminSendNotice(@Args('input') input: NewNoticeMessagesInput) {
    const roomInfo = await this.roomService.checkRoomPublish(ADMIN_ID_CHAT);
    const message = await this.messageService.sendMessageNotice(input, roomInfo.id);
    this.pubSub.publish(NEW_MESSAGE, { newMessage: message, type: 'notice' });

    return Promise.all([await this.roomService.updateAtRoom(roomInfo.id)]).then((values) => {
      const roomInfo = values[0];
      this.pubSub.publish(UPDATE_ROOM_LIST, {
        updateRoomList: roomInfo,
        type: 'notice',
        senderId: ADMIN_ID_CHAT,
      });
      this.joinUserPrivateRoom(roomInfo.id, ADMIN_ID_CHAT);
      return message;
    });
  }

  joinUserPrivateRoom = async (roomId: string, userId: string) => {
    const roomMembers = await this.roomService.getMemberOfRoomNotEqualUser(roomId, userId);
    if (roomMembers && roomMembers.length) {
      const userOrther = roomMembers[0];
      const result = await this.roomService.getLeaveStatus(roomId, userOrther.userId);
      if (result.isLeave) {
        return Promise.all([
          await this.roomService.joinRoomPrivate(roomId, result.userId),
          await this.roomService.getRoomInfo(roomId),
        ]).then((values) => {
          const roomInfo = values[1];
          this.pubSub.publish(JOIN_ROOM, { userJoinRoom: roomInfo, userId: result.userId });
          return result;
        });
      }
    }

    // if (result.isLeave)
  };

  @Mutation(() => TypingConnection, { nullable: false })
  @AppAuth()
  async typingMessage(@Args('input') input: TypingMessagesInput, @CurrentUser() user: User) {
    const { type, roomId } = input;
    const typeingConnection: TypingConnection = {
      type,
      userId: user.id,
      roomId,
    };
    const { isMember } = await this.roomService.checkMemberOfRoom(input.roomId, user);
    // if (isMember) {
    //     this.pubSub.publish(UPDATE_TYPEPING, { updateTyping: typeingConnection });
    //     this.pubSub.publish(UPDATE_TYPEPING_LIST, { updateTypingList: typeingConnection });
    // }
    return typeingConnection;
  }

  // @AppSubAuth()
  @Subscription((returns) => MessageRedis, {
    filter: (payload, variables, context) => {
      if (payload.newMessage.type === 'notice') {
        return true;
      }
      if (variables.roomId === payload.newMessage.roomId) {
        return true;
      }
      return false;
    },
  })
  newMessage(@Args('roomId') roomId: string) {
    return this.pubSub.asyncIterator(NEW_MESSAGE);
  }
  // @AppSubAuth()
  @Subscription((returns) => TypingConnection, {
    filter: (payload, variables, context) => {
      const user = getUserFromContextConnection(context);
      if (variables.roomId === payload.updateTyping.roomId && user.id !== payload.updateTyping.userId) {
        return true;
      }
      return false;
    },
  })
  updateTyping(@Args('roomId') roomId: string) {
    return this.pubSub.asyncIterator(UPDATE_TYPEPING);
  }

  @AppSubAuth()
  @Subscription((returns) => TypingConnection, {
    filter: (payload, variables, context) => {
      const user = getUserFromContextConnection(context);
      if (user.id !== payload.updateTypingList.userId) {
        return true;
      }
      return false;
    },
  })
  updateTypingList() {
    return this.pubSub.asyncIterator(UPDATE_TYPEPING_LIST);
  }
  // @AppSubAuth()
  @Subscription((returns) => RoomRedis, {
    filter: (payload: PayloadUpdateRoomList, variables, context) => {
      const user = getUserFromContextConnection(context);
      const { type, senderId, members } = payload;
      let userIdSub;
      if (user.roles.includes(RoleEnum.ADMIN) || user.roles.includes(RoleEnum.SUPER_ADMIN)) {
        userIdSub = ADMIN_ID_CHAT;
      } else {
        userIdSub = user.id;
      }
      if (type === 'notice') {
        if (user.roles.includes(RoleEnum.ADMIN) || user.roles.includes(RoleEnum.SUPER_ADMIN)) {
          return false;
        }
        return true;
      }
      if (members.includes(userIdSub)) {
        if (type === 'seen') {
          if (senderId !== userIdSub) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    },
  })
  updateRoomList() {
    return this.pubSub.asyncIterator(UPDATE_ROOM_LIST);
  }

  // @AppSubAuth()
  @Subscription((returns) => RoomRedis, {
    filter: (payload, variables, context) => {
      const user = getUserFromContextConnection(context);
      const { members } = payload;
      if (members.includes(user.id)) {
        return true;
      }
      return false;
    },
  })
  updateRoomInfo(@Args('roomId') roomId: string) {
    return this.pubSub.asyncIterator(UPDATE_ROOM);
  }

  // @AppSubAuth()
  @Subscription((returns) => RoomRedis, {
    filter: (payload, variables, context) => {
      const user = getUserFromContextConnection(context);
      const { userId } = payload;
      if (user.id === userId) {
        return true;
      }
      return false;
    },
  })
  userLeaveRoom() {
    return this.pubSub.asyncIterator(LEAVE_ROOM);
  }

  // @AppSubAuth()
  @Subscription((returns) => RoomRedis, {
    filter: (payload, variables, context) => {
      const user = getUserFromContextConnection(context);
      const { userId } = payload;
      if (user.id === userId) {
        return true;
      }
      return false;
    },
  })
  userJoinRoom() {
    return this.pubSub.asyncIterator(JOIN_ROOM);
  }
}
