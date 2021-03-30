import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { ProductGroupService } from '../services/productgroup.service';
import { NewProductGroupInput, UpdateProductGroupInput } from '../dto/new_productgroup.input';
import { ProductGroupConnection } from '../entities/productgroup.entity';
import { ProductGroupListArgs } from '../dto/productgroup.args';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { UserDataLoader } from '../../users/dataloaders/users.dataloader';
import { ProductGroup } from '../entities/productgroup.entity';
import { ID } from '@nestjs/graphql';

@Resolver(() => ProductGroup)
export class ProductGroupResolver {
  constructor(private readonly productgroupService: ProductGroupService, private readonly userDataLoader: UserDataLoader) {}

  @Query(() => ProductGroupConnection, {
    nullable: true,
  })
  async productgroups(@Args() args: ProductGroupListArgs) {
    console.log(process.pid);
    return await this.productgroupService.paginationCursor(args);
  }

  @ResolveField(() => User, {
    nullable: true,
  })
  owner(@Parent() category: ProductGroup) {
    return this.userDataLoader.load(category.ownerId);
  }

  @Query(() => ProductGroup, {
    nullable: true,
  })
  async productgroup(@Args({ type: () => ID, name: 'id', nullable: true }) id: string) {
    return await this.productgroupService.findById(id);
  }

  // Create ProductGroup
  @Mutation(() => ProductGroup)
  createProductGroup(@Args('input') input: NewProductGroupInput, @CurrentUser() currentUser: User) {
    return this.productgroupService.create({ ...input, ownerId: currentUser ? currentUser.id : "5505434365452091393" });
    // return this.productgroupService.create({ ...input, ownerId: "5504459403144724481" });
  }

  // update ProductGroup
  @Mutation(() => ProductGroup)
  @AuthJwt() // auth to update
  async updateProductGroup(@Args('input') input: UpdateProductGroupInput, @CurrentUser() currentUser: User) {
    const category = await this.productgroupService.findById(input.id);
    console.log(999, category);
    console.log(currentUser)
    if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.productgroupService.update(input.id, { ...input, roles: [{ role: 'read', userId: 1 }] });
  }

  // Remove category
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removeProductGroup(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.productgroupService.removeProductGroup(id);
  }
}
