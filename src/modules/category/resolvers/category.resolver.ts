import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { NewCategoryInput, UpdateCategoryInput } from '../dto/new_category.input';
import { CategoryConnection } from '../entities/category.entity';
import { CategoryListArgs } from '../dto/category.args';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { UserDataLoader } from '../../users/dataloaders/users.dataloader';
import { Category } from '../entities/category.entity';
import { ID } from '@nestjs/graphql';

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService, private readonly userDataLoader: UserDataLoader) {}

  @Query(() => CategoryConnection, {
    nullable: true,
  })
  async categories(@Args() args: CategoryListArgs) {
    console.log(process.pid);
    return await this.categoryService.paginationCursor(args);
  }

  @ResolveField(() => User, {
    nullable: true,
  })
  owner(@Parent() category: Category) {
    return this.userDataLoader.load(category.ownerId);
  }

  @Query(() => Category, {
    nullable: true,
  })
  async category(@Args({ type: () => ID, name: 'id', nullable: true }) id: string) {
    return await this.categoryService.findById(id);
  }

  // Create Category
  @Mutation(() => Category)
  createCategory(@Args('input') input: NewCategoryInput, @CurrentUser() currentUser: User) {
    return this.categoryService.create({ ...input, ownerId: currentUser ? currentUser.id : "5505434365452091393" });
    // return this.categoryService.create({ ...input, ownerId: "5504459403144724481" });
  }

  // update Category
  @Mutation(() => Category)
  @AuthJwt() // auth to update
  async updateCategory(@Args('input') input: UpdateCategoryInput, @CurrentUser() currentUser: User) {
    const category = await this.categoryService.findById(input.id);
    console.log(999, category);
    console.log(currentUser)
    if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.categoryService.update(input.id, { ...input, roles: [{ role: 'read', userId: 1 }] });
  }

  // Remove category
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removeCategory(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.categoryService.removeCategory(id);
  }
}
