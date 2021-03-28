import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthModuleOptions, JWTDecodeValue } from '../auth.interface';
import { UsersService } from 'src/modules/users/services/users.service';
import { AUTH_MODULE_OPTIONS } from '../auth.constants';
import { Request } from 'express';

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(Strategy, 'cookie') {
  constructor(
    private readonly userService: UsersService,
    @Inject(AUTH_MODULE_OPTIONS) readonly options: AuthModuleOptions,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        return req.cookies.token as string | undefined;
      },
      ignoreExpiration: false,
      secretOrKey: options.secret,
      passReqToCallback: true,
    });
  }

  validate = async (req: Request, payload: JWTDecodeValue) => {
    const accessToken = req?.cookies?.token as string | undefined;
    if (!accessToken) {
      throw new UnauthorizedException();
    }
    try {
      return await this.userService.findOne(payload.username);
    } catch (err) {
      throw new UnauthorizedException();
    }
  };
}
