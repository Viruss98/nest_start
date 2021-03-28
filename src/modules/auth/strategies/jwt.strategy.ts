import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { AUTH_MODULE_OPTIONS } from '../auth.constants';
import { Payload, AuthModuleOptions } from '../auth.interface';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UsersService,
    @Inject(AUTH_MODULE_OPTIONS) readonly options: AuthModuleOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: options.secret,
    });
  }

  validate = async (payload: Payload) => {
    try {
      return await this.userService.findOne(payload.username);
    } catch (err) {
      throw new UnauthorizedException();
    }
  };
}
