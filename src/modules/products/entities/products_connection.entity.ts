import { ObjectType } from '@nestjs/graphql';
import { ProductEntity } from './products.entity';
import { PaginationBase } from 'src/graphql/types/common.interface.entity';

@ObjectType({
  description: 'Product list',
})
export class ProductConnection extends PaginationBase(ProductEntity) {}
