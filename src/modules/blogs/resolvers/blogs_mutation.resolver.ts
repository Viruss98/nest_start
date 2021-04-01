import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { BlogsService } from '../services/blogs.service';
import { NewBlogInput, UpdateBlogInput } from '../dto/new_blog.input';
import { BlogEntity } from '../entities/blog.entity';
import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
import { User } from '../../users/entities/users.entity';
import { ID } from '@nestjs/graphql';
import { Category } from '../../category/entities/category.entity';
import { In } from 'typeorm';

@Resolver(() => BlogEntity)
export class BlogsMutationResolver {
  constructor(private readonly blogService: BlogsService) {}

  @Mutation(() => BlogEntity)
  async createBlog(@Args('input') input: NewBlogInput) {
    // const blog = await this.blogService.create(input);
    // // await this.sonicIngestService.push('blog', 'blog', `id:${blog.id}`, blog.title, {
    // //     lang: 'vie',
    // // });

    // return blog;
    const blog = new BlogEntity();
    blog.title = input.title;
    blog.content = input.content;
    blog.blogcates = [];
    const blogCates = Category.find({ where: { id: In(input.listIds) } });
    blog.blogcates = await blogCates;
    await blog.save();
    return blog;
  }

  // update blog
  @Mutation(() => BlogEntity)
  @AuthJwt() // auth to update
  async updateBlog(@Args('input') input: UpdateBlogInput, @CurrentUser() currentUser: User) {
    const blog = await this.blogService.findById(input.id);
    console.log(999, blog);
    console.log(currentUser);
    // if (category.ownerId !== currentUser.id) throw new ForbiddenException();

    return this.blogService.update(input.id, { ...input });
  }

  // Remove blog
  @Mutation(() => Boolean)
  @AuthJwt() // auth to delete
  async removeBlog(@Args({ type: () => ID, name: 'id', nullable: true }) id: string): Promise<boolean> {
    return await this.blogService.removeBlog(id);
  }
}
