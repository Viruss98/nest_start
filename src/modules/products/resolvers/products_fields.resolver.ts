import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { ProductEntity } from '../entities/products.entity';
// import { Category } from 'src/modules/category/entities/category.entity';
// import { CategoryDataLoader } from '../../category/dataloaders/category.dataloader';

@Resolver(() => ProductEntity)
export class ProductsFieldsResolver {
  constructor() {
    // private readonly categoryDataLoader: CategoryDataLoader
  }
  @ResolveField()
  title(@Parent() product: ProductEntity) {
    return product.title;
  }

  // @ResolveField(() => [Category])
  // categories(@Parent() blog: BlogEntity) {
  //   // return [];
  //   return blog.categories;
  // }
}
