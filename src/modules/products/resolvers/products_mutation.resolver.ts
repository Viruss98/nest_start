import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from '../services/products.service';
import { NewProductInput, UpdateProductInput } from '../dto/new_product.input';
import { ProductEntity } from '../entities/products.entity';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { ID } from '@nestjs/graphql';

@Resolver(() => ProductEntity)
export class ProductsMutationResolver {
  constructor(private readonly productService: ProductsService) {}

  @Mutation(() => ProductEntity)
  async createProduct(@Args('input') input: NewProductInput) {
    const product = await this.productService.create(input);
    // await this.sonicIngestService.push('product', 'product', `id:${product.id}`, product.title, {
    //     lang: 'vie',
    // });

    return product;
  }

  // update product
  @Mutation(() => ProductEntity)
  @AuthJwt() // auth to update
  async updateProduct(@Args('input') input: UpdateProductInput, @CurrentUser() currentUser: User) {
    const product = await this.productService.findById(input.id);
    console.log(999, product);
    console.log(currentUser)
    // if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.productService.update(input.id, { ...input });
  }

  // Remove product
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removeProduct(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.productService.removeProduct(id);
  }
}
