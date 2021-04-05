import { registerEnumType } from '@nestjs/graphql';

export enum RoomTypeEnum {
  PRIVATE = 'PRIVATE',
  PRIVATE_WITH_ADMIN = 'PRIVATE_WITH_ADMIN',
  GROUP = 'GROUP',
  PUBLISH = 'PUBLISH',
}

registerEnumType(RoomTypeEnum, {
  name: 'RoomTypeEnum',
});

export enum RoomMemberTypeEnum {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

registerEnumType(RoomMemberTypeEnum, {
  name: 'RoomMemberTypeEnum',
});

export enum ActionMemberTypeEnum {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

registerEnumType(ActionMemberTypeEnum, {
  name: 'ActionMemberTypeEnum',
});
