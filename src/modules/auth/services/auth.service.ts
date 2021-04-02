import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/services/users.service';
import { User } from 'src/modules/users/entities/users.entity';
import type { Payload, JWTDecodeValue } from '../auth.interface';
import { AuthRepository } from '../repositories/auth.repository';
import { ApolloError } from 'apollo-server';
import jwtDecode from 'jwt-decode';
import { AuthTokenEntity } from '../entities/auth.entity';
import { DeepPartial, FindConditions } from 'typeorm';
import { snowflake } from 'src/helpers/common';
import { RoleEnum } from 'src/graphql/enums/roles';
import { ProviderLoginEnum } from 'src/graphql/enums/provider_login';
import moment from 'moment';
import { GraphQLContext } from 'src/graphql/app.graphql-context';

type JwtGenerateOption = {
  audience?: string | string[];
  issuer?: string;
  jwtid?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  findOne = async (conditions?: FindConditions<AuthTokenEntity>) => {
    return await this.authRepository.findOne(conditions);
  };

  validateUser = async (
    username: string,
    pass: string,
  ): Promise<Omit<User, 'password' | 'passwordSalt'> | undefined> => {
    const user = await this.usersService.login(username, pass);
    if (user) {
      const { password, passwordSalt, ...result } = user;
      return result;
    } else {
      throw new Error('User not found');
    }
  };

  login = async (username: string, password: string, provider: string, ctx: GraphQLContext) => {
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new ApolloError('Error');
    }
    // if (!user) {
    //   throw new ApolloError(commonMessage.login_fail, 'login_fail', {
    //     title: commonTitle.login_fail,
    //   });
    // }

    // if (!user.isActive) {
    //   throw new ApolloError(commonMessage.account_deactive, 'account_deactive', {
    //     title: commonTitle.account_deactive,
    //   });
    // }

    // if (provider !== ProviderLoginEnum.WEB_ADMIN) {
    //   if (user.roles.includes(RoleEnum.SUPER_ADMIN) || user.roles.includes(RoleEnum.ADMIN)) {
    //     throw new ApolloError('You cannot login in Mobile App or Web App');
    //   }
    // } else {
    //   if (
    //     (user.roles.includes(RoleEnum.BUYER) && !user.roles.includes(RoleEnum.PARTNER)) ||
    //     (user.roles.includes(RoleEnum.PARTNER) && !user.isActivePartner)
    //   ) {
    //     throw new ApolloError('You cannot login in Admin web');
    //   }
    // }
    let audience;
    if(user.roles) {
      if (user.roles.includes(RoleEnum.SUPER_ADMIN)) {
        audience = RoleEnum.SUPER_ADMIN;
      } else if (user.roles.includes(RoleEnum.ADMIN)) {
        audience = RoleEnum.ADMIN;
      } else if (user.roles.includes(RoleEnum.PARTNER)) {
        audience = RoleEnum.PARTNER;
      } else {
        audience = 'user';
      }
    }
    try {
      const authToken = await this.saveAuthToken(user.id, user.username, {
        issuer: 'thedv',
        audience: [audience],
      });
      if (!authToken) {
        throw new ApolloError('Error');
      }
      if (provider === ProviderLoginEnum.WEB_ADMIN) {
        // Set accessToken
        ctx.res.cookie('token', authToken.accessToken, {
          expires: moment(jwtDecode<JWTDecodeValue>(authToken.accessToken).exp * 1000).toDate(),
          sameSite: false,
          httpOnly: true,
        });

        // Set refreshToken
        ctx.res.cookie('refreshToken', authToken.refreshToken, {
          expires: moment(jwtDecode<JWTDecodeValue>(authToken.refreshToken).exp * 1000).toDate(),
          sameSite: false,
          httpOnly: true,
        });
      }
      return {
        user,
        accessToken: authToken?.accessToken,
        refreshToken: authToken?.refreshToken,
      };
    } catch (err) {
      throw new ApolloError('Error');
    }
  };

  initAccessToken = (data: { payload: Payload; options?: JwtGenerateOption }) => {
    const { payload, options } = data;
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `30 days`,
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `35 days`,
      }),
    };
  };

  saveAuthToken = async (userId: string, username: string, options?: JwtGenerateOption) => {
    const { accessToken, refreshToken } = this.initAccessToken({
      payload: {
        sub: userId,
        username,
      },
      options,
    });

    return await this.createToken({
      userId,
      accessToken,
      refreshToken,
    });
  };

  createToken = async (data: DeepPartial<AuthTokenEntity>) => {
    const authToken = this.authRepository.create({ id: snowflake.nextId(), ...data });
    const newAuthToken = await this.authRepository.save(authToken);
    return await this.authRepository.findOne(newAuthToken.id);
  };

  refreshToken = async (refreshToken: string) => {
    try {
      const currentPayload: Payload = await this.jwtService.verifyAsync(refreshToken, {
        ignoreExpiration: false,
      });
      const token = await this.authRepository.findOne({ where: { refreshToken } });
      if (!token) {
        throw new ApolloError('invalid_token');
      }
      const decoded = jwtDecode<JWTDecodeValue>(token.accessToken);
      const decodedRefreshToken = jwtDecode<JWTDecodeValue>(token.refreshToken);
      const payload: Payload = {
        username: currentPayload.username,
        sub: currentPayload.sub,
      };
      const refreshPayload: Payload = {
        username: currentPayload.username,
        sub: currentPayload.sub,
      };
      token.accessToken = this.jwtService.sign(payload, {
        expiresIn: `30 days`,
        issuer: decoded.iss,
        audience: decoded.aud,
      });
      token.refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: `35 days`,
        issuer: decodedRefreshToken.iss,
        audience: decodedRefreshToken.aud,
      });
      const newToken = await this.updateToken(token);
      const user = this.usersService.findOne(currentPayload.username);
      if (newToken) {
        return {
          user,
          accessToken: newToken.accessToken,
          refreshToken: newToken.refreshToken,
        };
      }
    } catch (error) {
      throw new ApolloError('invalid_token');
    }
  };

  updateToken = async (data: Partial<AuthTokenEntity>) => {
    if (data.id) {
      delete data.updatedAt;
      await this.authRepository.update(data.id, data);
      return await this.authRepository.findOne(data.id);
    }
  };

  logoutUser = async (user: User) => {
    const authToken = await this.authRepository.find({ userId: user.id });
    if (authToken) {
      await this.authRepository.remove(authToken);
    }
    return true;
  };
}
