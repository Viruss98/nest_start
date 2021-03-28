import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { NewCategoryInput, UpdateCategoryInput } from '../dto/new_category.input';
import { CategoryConnection } from '../entities/category.entity';
import { CategoryListArgs } from '../dto/category.args';
import { CurrentUser } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { UserDataLoader } from '../../users/dataloaders/users.dataloader';
import { Category } from '../entities/category.entity';

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

  // Create Category
  @Mutation(() => Category)
  createCategory(@Args('input') input: NewCategoryInput, @CurrentUser() currentUser: User) {
    // return this.categoryService.create({ ...input, ownerId: currentUser.id || "5504459403144724481" });
    return this.categoryService.create({ ...input, ownerId: "5504459403144724481" });
  }

  // Create Category
  @Mutation(() => Category)
  async updateCategory(@Args('input') input: UpdateCategoryInput, @CurrentUser() currentUser: User) {
    const category = await this.categoryService.findById(input.id);
    console.log(999, category);
    if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.categoryService.update(input.id, { ...input, roles: [{ role: 'read', userId: 1 }] });
  }
}
