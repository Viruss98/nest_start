import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';

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

  roles?: string[];
}
