import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { ProductCateService } from '../services/productcate.service';
import { NewProductCateInput, UpdateProductCateInput } from '../dto/new_productcate.input';
import { ProductCateConnection } from '../entities/productcate.entity';
import { ProductCateListArgs } from '../dto/productcate.args';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { UserDataLoader } from '../../users/dataloaders/users.dataloader';
import { ProductCate } from '../entities/productcate.entity';
import { ID } from '@nestjs/graphql';

@Resolver(() => ProductCate)
export class ProductCateResolver {
  constructor(private readonly productcateService: ProductCateService, private readonly userDataLoader: UserDataLoader) {}

  @Query(() => ProductCateConnection, {
    nullable: true,
  })
  async productcates(@Args() args: ProductCateListArgs) {
    console.log(process.pid);
    return await this.productcateService.paginationCursor(args);
  }

  @ResolveField(() => User, {
    nullable: true,
  })
  owner(@Parent() category: ProductCate) {
    return this.userDataLoader.load(category.ownerId);
  }

  @Query(() => ProductCate, {
    nullable: true,
  })
  async productcate(@Args({ type: () => ID, name: 'id', nullable: true }) id: string) {
    return await this.productcateService.findById(id);
  }

  // Create ProductCate
  @Mutation(() => ProductCate)
  createProductCate(@Args('input') input: NewProductCateInput, @CurrentUser() currentUser: User) {
    return this.productcateService.create({ ...input, ownerId: currentUser ? currentUser.id : "5505434365452091393" });
    // return this.productcateService.create({ ...input, ownerId: "5504459403144724481" });
  }

  // update ProductCate
  @Mutation(() => ProductCate)
  @AuthJwt() // auth to update
  async updateProductCate(@Args('input') input: UpdateProductCateInput, @CurrentUser() currentUser: User) {
    const category = await this.productcateService.findById(input.id);
    console.log(999, category);
    console.log(currentUser)
    if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.productcateService.update(input.id, { ...input, roles: [{ role: 'read', userId: 1 }] });
  }

  // Remove category
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removeProductCate(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.productcateService.removeProductCate(id);
  }
}
