import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { RoleEnum } from 'src/graphql/enums/roles';

@InputType()
export class NewUserInput {
  @MinLength(3)
  @MaxLength(50)
  username: string;

  password?: string;

  firstName?: string;

  lastName?: string;

  @Field(() => Int)
  age?: number;

  roles?: RoleEnum[];
}

@InputType()
export class UpdatePassInput {
  @MinLength(3)
  @MaxLength(50)
  newpassword: string;

  username: string;

  temppass: string;
}
