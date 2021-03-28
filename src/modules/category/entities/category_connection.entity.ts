import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from 'src/graphql/types/common.interface.entity';
import { Category } from './category.entity';

@ObjectType('CategoryEdge', {
  description: 'CategoryEdge',
})
export class CategoryEdge {
  node: Category;
  cursor: string;
}

@ObjectType('CategoryConnection', {
  description: 'CategoryConnection',
})
export class CategoryConnection {
  edges?: CategoryEdge[];

  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}
