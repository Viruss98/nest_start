import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ProductsService } from '../services/products.service';
import { NewProductInput, UpdateProductInput } from '../dto/new_product.input';
import { ProductEntity } from '../entities/products.entity';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { ID } from '@nestjs/graphql';
import { ProductCate } from '../../productcate/entities/productcate.entity';

@Resolver(() => ProductEntity)
export class ProductsMutationResolver {
  constructor(private readonly productService: ProductsService) {}

  @Mutation(() => ProductEntity)
  async createProduct(@Args('input') input: NewProductInput) {
    // console.log(input)
    // const product = await this.productService.create(input);
    // // await this.sonicIngestService.push('product', 'product', `id:${product.id}`, product.title, {
    // //     lang: 'vie',
    // // });
    //
    // return product;
    const product = new ProductEntity();
    // product.title = input.title;
    // product.content = input.content;
    product.productcates = [];
    for (let i = 0; i < input.listIds.length ; i++) {
      const cate = await ProductCate.findOne(input.listIds[i]);
      product.productcates.push(cate);
    }
    await product.save();
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
