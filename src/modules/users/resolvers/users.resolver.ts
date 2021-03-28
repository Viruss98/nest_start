import { Resolver, Args, Mutation, Query, ResolveField, Parent } from '@nestjs/graphql';
import { UsersService } from '../services/users.service';
import { User, UserConnection } from '../entities/users.entity';
import { NewUserInput } from '../dto/new_user.input';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Query(() => UserConnection, { name: 'users', nullable: true })
  users() {
    return this.userService.pagination();
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

  @Mutation(() => Boolean)
  sendMail() {
    this.userService.sendMail();
    return true;
  }
}
