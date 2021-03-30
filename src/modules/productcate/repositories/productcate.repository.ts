import { EntityRepository } from 'typeorm';
import { ProductCate } from '../entities/productcate.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(ProductCate)
export class ProductCateRepository extends CommonRepository<ProductCate> {}
