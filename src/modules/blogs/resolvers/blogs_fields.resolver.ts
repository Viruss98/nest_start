import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { BlogEntity } from '../entities/blog.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { CategoryDataLoader } from '../../category/dataloaders/category.dataloader';

@Resolver(() => BlogEntity)
export class BlogsFieldsResolver {
  constructor(private readonly categoryDataLoader: CategoryDataLoader) {
    //
  }
  @ResolveField()
  title(@Parent() blog: BlogEntity) {
    return blog.title;
  }

  @ResolveField(() => [Category])
  categories(@Parent() blog: BlogEntity) {
    // return [];
    return blog.categories;
  }
}
