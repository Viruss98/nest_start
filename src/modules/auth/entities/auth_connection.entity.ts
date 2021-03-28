import { ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/users.entity';

@ObjectType({
  description: 'AuthConnection',
})
export class AuthConnection {
  accessToken: string;
  refreshToken: string;

  user: User;
}
