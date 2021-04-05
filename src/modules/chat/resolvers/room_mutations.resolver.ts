import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AppAuth, CurrentUser } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/users.entity';
import { CheckRoomInput, CreateRoomInput } from '../dto/create_room.input';
import { Room } from '../entities/room.entity';
import { RoomService } from '../services/room.service';

@Resolver(() => Room)
export class RoomsMutationResolver {
  constructor(private readonly roomService: RoomService) { }

  @Mutation(() => Room)
  @AppAuth()
  createRoom(@Args('input') input: CreateRoomInput, @CurrentUser() user: User) {
    return this.roomService.createRoom(input, user?.id);
  }

  @Mutation(() => Room, { nullable: true, defaultValue: false })
  @AppAuth()
  checkRoom(@Args('input') input: CheckRoomInput, @CurrentUser() user: User) {
    return this.roomService.checkRoom(input, user?.id);
  }

  @Mutation(() => Room, { nullable: true, defaultValue: false })
  @AppAuth()
  createRoomWithAdmin(@Args('input') input: CreateRoomInput, @CurrentUser() user: User) {
    return this.roomService.createRoomWithAdmin(input, user?.id);
  }
}
