import { EntityRepository } from 'typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(BlogEntity)
export class BlogRepository extends CommonRepository<BlogEntity> {}
