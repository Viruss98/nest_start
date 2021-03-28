import { EntityRepository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(Category)
export class CategoryRepository extends CommonRepository<Category> {}
