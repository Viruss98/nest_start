import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { CurrentUser } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthConnection } from '../entities/auth_connection.entity';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import type { JWTDecodeValue } from '../auth.interface';
import { GraphQLContext } from 'src/graphql/app.graphql-context';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  @Query(() => User, {
    name: 'me',
  })
  @UseGuards(GqlAuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return this.userService.findOne(user.username);
  }

  @Mutation(() => AuthConnection)
  async login(@Args('username') username: string, @Args('password') password: string, @Context() ctx: GraphQLContext) {
    const data = await this.authService.login(username, password);

    ctx.res.cookie('token', data.accessToken, {
      expires: moment(jwtDecode<JWTDecodeValue>(data.accessToken).exp * 1000).toDate(),
      sameSite: false,
      httpOnly: true,
    });
    ctx.res.cookie('refreshToken', data.refreshToken, {
      expires: moment(jwtDecode<JWTDecodeValue>(data.refreshToken).exp * 1000).toDate(),
      sameSite: false,
      httpOnly: true,
    });
    return data;
  }
}
