import { InputType } from '@nestjs/graphql';

@InputType()
export class LoginAdminInput {
  username: string;

  password: string;
}
