import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class ProductArgs {
  @Field(() => Int)
  @Min(0)
  page: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit: number;
}
