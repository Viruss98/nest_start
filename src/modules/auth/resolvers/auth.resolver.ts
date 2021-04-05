import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AppAuth, CurrentUser, AdminAuth } from 'src/decorators/common.decorator';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { AuthConnection } from '../entities/auth_connection.entity';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import type { JWTDecodeValue } from '../auth.interface';
import { GraphQLContext } from 'src/graphql/app.graphql-context';
import { AppLoginInput } from '../dto/login.input';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService, private readonly userService: UsersService) {}

  // @Query(() => User, {
  //   name: 'me',
  // })
  // @UseGuards(GqlAuthGuard)
  // whoAmI(@CurrentUser() user: User) {
  //   return this.userService.findOne(user.username);
  // }
  @Query(() => User, {
    name: 'me',
    description: 'Get current user authentication',
  })
  @AppAuth()
  whoAmI(@CurrentUser() user: User) {
    return this.userService.findOne(user.username);
  }

  @Query(() => User, {
    description: 'Get current web admin user authentication',
  })
  @AdminAuth()
  meAdmin(@CurrentUser() user: User) {
    return this.userService.findOne(user.username);
  }

  @Mutation(() => Boolean)
  @AppAuth()
  async logoutUser(@CurrentUser() currentUser: User) {
    return this.authService.logoutUser(currentUser);
  }

  // @Mutation(() => Boolean)
  // @AdminAuth()
  // async logoutAdmin(@CurrentUser() currentUser: User, @Context() ctx: GraphQLContext) {
  //   return this.adminAuthService.logoutAdmin(currentUser?.id, ctx);
  // }
  @Mutation(() => AuthConnection)
  refreshToken(@Args('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Mutation(() => AuthConnection)
  async login(@Args('input') input: AppLoginInput, @Context() ctx: GraphQLContext) {
    const data = await this.authService.login(input.username, input.password, input.provider ? input.provider : "WEB", ctx);

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

  // @Mutation(() => AdminAuthConnection)
  // async loginAdmin(@Args('input') input: LoginAdminInput, @Context() ctx: GraphQLContext) {
  //   return this.adminAuthService.login(input.username, input.password, ctx);
  // }
}
