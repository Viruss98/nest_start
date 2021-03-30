import { EntityRepository } from 'typeorm';
import { ProductGroup } from '../entities/productgroup.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(ProductGroup)
export class ProductGroupRepository extends CommonRepository<ProductGroup> {}
