import { Resolver, Query, Args } from '@nestjs/graphql';
import { BlogsService } from '../services/blogs.service';
import { BlogConnection } from '../entities/blog_connection.entity';
import { Int, ID } from '@nestjs/graphql';
import { BlogDataLoader } from '../dataloaders/blog.dataloader';
import { BlogEntity } from '../entities/blog.entity';
import { BlogArgs } from '../dto/blog.args';

@Resolver(() => BlogEntity)
export class BlogsQueryResolver {
  constructor(private readonly blogService: BlogsService, private readonly blogDataLoader: BlogDataLoader) {}

  @Query(() => BlogEntity, {
    nullable: true,
    description: 'BLog Detail',
  })
  async blog(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.blogDataLoader.load(id);
  }

  @Query(() => BlogConnection, { nullable: true })
  async blogs(@Args() args: BlogArgs) {
    return this.blogService.pagination(args);
  }
}
