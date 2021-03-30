import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from 'src/graphql/types/common.interface.entity';
import { ProductCate } from './productcate.entity';

@ObjectType('ProductCateEdge', {
  description: 'ProductCateEdge',
})
export class ProductCateEdge {
  node: ProductCate;
  cursor: string;
}

@ObjectType('ProductCateConnection', {
  description: 'ProductCateConnection',
})
export class ProductCateConnection {
  edges?: ProductCateEdge[];

  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}
