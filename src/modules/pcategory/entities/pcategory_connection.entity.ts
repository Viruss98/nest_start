import { Field, ObjectType, Int } from '@nestjs/graphql';
import { PageInfo } from 'src/graphql/types/common.interface.entity';
import { PCategory } from './pcategory.entity';

@ObjectType('PCategoryEdge', {
  description: 'PCategoryEdge',
})
export class PCategoryEdge {
  node: PCategory;
  cursor: string;
}

@ObjectType('PCategoryConnection', {
  description: 'PCategoryConnection',
})
export class PCategoryConnection {
  edges?: PCategoryEdge[];

  @Field(() => Int)
  totalCount: number;

  pageInfo: PageInfo;
}
