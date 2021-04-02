import { Resolver, Args, Mutation, Query, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { User, UserConnection } from '../entities/users.entity';
import { NewUserInput, UpdatePassInput } from '../dto/new_user.input';
import { UserListArgs } from '../dto/user.args';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => UserConnection, { name: 'users', nullable: true })
  users(@Args() args: UserListArgs) {
    return this.userService.pagination(args);
  }

  @Mutation(() => User)
  createUser(@Args('input') input: NewUserInput) {
    return this.userService.create(input);
  }

  @ResolveField(() => String, {
    nullable: true,
  })
  fullName(@Parent() user: User): string {
    return `${user.firstName} ${user.lastName ?? ''}`;
  }

  @Mutation(() => User)
  userChangePass(@Args('input') args: UpdatePassInput) {
    return this.userService.userChangePass(args);
  }

  // @Mutation(() => Boolean)
  // sendMail(a,b) {
  //   this.userService.sendMail(a,b);
  //   return true;
  // }
}
