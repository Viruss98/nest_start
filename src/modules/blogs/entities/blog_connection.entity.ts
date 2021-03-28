import { ObjectType } from '@nestjs/graphql';
import { BlogEntity } from './blog.entity';
import { PaginationBase } from 'src/graphql/types/common.interface.entity';

@ObjectType({
  description: 'Blog list',
})
export class BlogConnection extends PaginationBase(BlogEntity) {}
