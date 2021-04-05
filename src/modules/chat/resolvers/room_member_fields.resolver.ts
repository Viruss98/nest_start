import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { RoomMember } from '../entities/room_member.entity';
import { ADMIN_ID_CHAT } from 'src/helpers/constants';

@Resolver(() => RoomMember)
export class RoomMembersFieldsResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField(() => User, {
    nullable: true,
    defaultValue: null,
  })
  async user(@Parent() roomMember: RoomMember) {
    if (roomMember.userId !== ADMIN_ID_CHAT) {
      // return this.usersService.findByUserId(roomMember.userId);
    }
    return null;
  }
}
