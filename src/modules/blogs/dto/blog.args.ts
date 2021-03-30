import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';
import {ProductEntity} from "../../products/entities/products.entity";

@ArgsType()
export class BlogArgs {
  @Field(() => Int)
  @Min(0)
  page: number;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  limit: number;

  // @Field({ nullable: true })
  // filters?: any[];
}
