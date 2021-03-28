import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { BlogsService } from '../services/blogs.service';
import { NewBlogInput } from '../dto/new_blog.input';
import { BlogEntity } from '../entities/blog.entity';

@Resolver(() => BlogEntity)
export class BlogsMutationResolver {
  constructor(private readonly blogService: BlogsService) {}

  @Mutation(() => BlogEntity)
  async createBlog(@Args('input') input: NewBlogInput) {
    const blog = await this.blogService.create(input);
    // await this.sonicIngestService.push('blog', 'blog', `id:${blog.id}`, blog.title, {
    //     lang: 'vie',
    // });

    return blog;
  }
}
