import { ArgsType, Field, Int } from '@nestjs/graphql';
import { SortInput } from './common.input';
import { GraphQLJSONObject } from 'graphql-type-json';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 15,
  })
  limit?: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page?: number;

  sort?: SortInput;
  // filters?: FilterInput[];

  @Field(() => [GraphQLJSONObject])
  filters?: any[];
}
