import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class UserListArgs {
  @Field(() => Int, {
    defaultValue: 15,
  })
  @Min(1)
  @Max(100)
  limit?: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  @Min(1)
  page?: number;
}
