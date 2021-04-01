import { Resolver, Query, Args } from '@nestjs/graphql';
import { BlogsService } from '../services/blogs.service';
import { BlogConnection } from '../entities/blog_connection.entity';
import { Int, ID } from '@nestjs/graphql';
import { BlogDataLoader } from '../dataloaders/blog.dataloader';
import { BlogEntity } from '../entities/blog.entity';
import { BlogArgs, BlogSearchArgs } from '../dto/blog.args';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';

@Resolver(() => BlogEntity)
export class BlogsQueryResolver {
  constructor(private readonly blogService: BlogsService, private readonly blogDataLoader: BlogDataLoader) {}

  @Query(() => BlogEntity, {
    nullable: true,
    description: 'BLog Detail',
  })
  @AuthJwt()
  async blog(@Args({ name: 'id', type: () => ID }) id: string) {
    return await this.blogDataLoader.load(id);
  }

  @Query(() => BlogConnection, { nullable: true })
  // @AuthJwt() // auth to get data @CurrentUser() currentUser: User
  async blogs(@Args() args: BlogArgs) {
    // console.log(currentUser);
    return this.blogService.pagination(args);
  }

  @Query(() => BlogConnection, {
    nullable: true,
  })
  async blogsByCate(@Args() args: BlogSearchArgs) {
    console.log(process.pid);
    return await this.blogService.paginationCursors(args);
  }
}
