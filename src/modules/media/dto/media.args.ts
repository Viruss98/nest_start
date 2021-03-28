import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class MediaArgs {
  @Field(() => Int, {
    defaultValue: 15,
  })
  @Min(0)
  @Max(100)
  limit: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page: number;
}
