import { Resolver, Query, Args } from '@nestjs/graphql';
import { AppAuth, CurrentUser, AdminAuth } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/users.entity';
import { GetRoomInput } from '../dto/room';
import { Room, RoomConnection } from '../entities/room.entity';
import { RoomService } from '../services/room.service';

@Resolver(() => Room)
export class RoomsQueriesResolver {
    constructor(private readonly roomService: RoomService) {}

    @Query(() => RoomConnection, { nullable: false })
    @AppAuth()
    rooms(@Args('input') input: GetRoomInput, @CurrentUser() user: User) {
        return this.roomService.rooms(input, user?.id);
    }

    @Query(() => RoomConnection, { nullable: false })
    @AdminAuth()
    adminRooms(@Args('input') input: GetRoomInput, @CurrentUser() user: User) {
        return this.roomService.adminRooms(input, user?.id);
    }

    @Query(() => Room, { nullable: false })
    @AdminAuth()
    adminRoom(@Args('roomId') roomId: string, @CurrentUser() user: User) {
        return this.roomService.room(roomId, user);
    }
    @Query(() => Room, { nullable: false })
    @AppAuth()
    room(@Args('roomId') roomId: string, @CurrentUser() user: User) {
        return this.roomService.room(roomId, user);
    }
}
