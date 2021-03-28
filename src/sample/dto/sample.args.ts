import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class SampleArgs {
  @Field(() => Int)
  @Min(0)
  skip: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take: number;
}
