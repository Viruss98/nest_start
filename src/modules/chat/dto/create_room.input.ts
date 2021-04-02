import { InputType } from '@nestjs/graphql';
import { RoomTypeEnum, ActionMemberTypeEnum } from 'src/graphql/enums/room_type';

@InputType()
export class CreateRoomInput {
    roomType: RoomTypeEnum;
    userIds: string[];
    roomName?: string;
    image?: string;
}

@InputType()
export class CheckRoomInput {
    userId: string;
}

@InputType()
export class AdminCreateRoomInput {
    roomName: string;
    userIds: string[];
}

@InputType()
export class AdminAddMemberInput {
    roomId: string;
    userId: string;
    type: ActionMemberTypeEnum;
}
