import { Resolver, Mutation, Args, Query, Parent, ResolveField } from '@nestjs/graphql';
import { ForbiddenException } from '@nestjs/common';
import { PCategoryService } from '../services/pcategory.service';
import { NewPCategoryInput, UpdatePCategoryInput } from '../dto/new_pcategory.input';
import { PCategoryConnection } from '../entities/pcategory.entity';
import { PCategoryListArgs } from '../dto/pcategory.args';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { UserDataLoader } from '../../users/dataloaders/users.dataloader';
import { PCategory } from '../entities/pcategory.entity';
import { ID } from '@nestjs/graphql';

@Resolver(() => PCategory)
export class PCategoryResolver {
  constructor(private readonly pcategoryService: PCategoryService, private readonly userDataLoader: UserDataLoader) {}

  @Query(() => PCategoryConnection, {
    nullable: true,
  })
  async categories(@Args() args: PCategoryListArgs) {
    console.log(process.pid);
    return await this.pcategoryService.paginationCursor(args);
  }

  @ResolveField(() => User, {
    nullable: true,
  })
  owner(@Parent() category: PCategory) {
    return this.userDataLoader.load(category.ownerId);
  }

  @Query(() => PCategory, {
    nullable: true,
  })
  async category(@Args({ type: () => ID, name: 'id', nullable: true }) id: string) {
    return await this.pcategoryService.findById(id);
  }

  // Create PCategory
  @Mutation(() => PCategory)
  createPCategory(@Args('input') input: NewPCategoryInput, @CurrentUser() currentUser: User) {
    return this.pcategoryService.create({ ...input, ownerId: currentUser ? currentUser.id : "5505434365452091393" });
    // return this.pcategoryService.create({ ...input, ownerId: "5504459403144724481" });
  }

  // update PCategory
  @Mutation(() => PCategory)
  @AuthJwt() // auth to update
  async updatePCategory(@Args('input') input: UpdatePCategoryInput, @CurrentUser() currentUser: User) {
    const category = await this.pcategoryService.findById(input.id);
    console.log(999, category);
    console.log(currentUser)
    if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.pcategoryService.update(input.id, { ...input, roles: [{ role: 'read', userId: 1 }] });
  }

  // Remove category
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removePCategory(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.pcategoryService.removePCategory(id);
  }
}
