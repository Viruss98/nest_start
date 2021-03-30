import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductsService } from '../services/products.service';
import { ProductConnection } from '../entities/products_connection.entity';
import { Int, ID } from '@nestjs/graphql';
import { ProductDataLoader } from '../dataloaders/product.dataloader';
import { ProductEntity } from '../entities/products.entity';
import { ProductArgs } from '../dto/product.args';

@Resolver(() => ProductEntity)
export class ProductsQueryResolver {
  constructor(private readonly productService: ProductsService, private readonly productDataLoader: ProductDataLoader) {}

  @Query(() => ProductEntity, {
    nullable: true,
    description: 'BLog Detail',
  })
  async product(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.productDataLoader.load(id);
  }

  @Query(() => ProductConnection, { nullable: true })
  async products(@Args() args: ProductArgs) {
    return this.productService.pagination(args);
  }

  // async allProducts(
  //       @Args() { title, limit, page }: ProductArgs
  //   ): Promise<ProductConnection[]> {
  //       if (title) {
  //           return this.productService.find({ where: { title: Like(`${title}%`), page, limit } })
  //       }
  //       return this.productService.find({ page, limit });
  //   }
}
