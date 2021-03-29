import { EntityRepository } from 'typeorm';
import { ProductEntity } from '../entities/products.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(ProductEntity)
export class ProductRepository extends CommonRepository<ProductEntity> {}
