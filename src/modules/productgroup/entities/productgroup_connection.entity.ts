import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from 'src/graphql/types/common.interface.entity';
import { ProductGroup } from './productgroup.entity';

@ObjectType('ProductGroupEdge', {
  description: 'ProductGroupEdge',
})
export class ProductGroupEdge {
  node: ProductGroup;
  cursor: string;
}

@ObjectType('ProductGroupConnection', {
  description: 'ProductGroupConnection',
})
export class ProductGroupConnection {
  edges?: ProductGroupEdge[];

  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}
