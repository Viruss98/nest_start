import { Injectable } from '@nestjs/common';
import { FindOneOptions  } from 'typeorm';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogEntity } from '../entities/blog.entity';
import { BlogConnection } from '../entities/blog_connection.entity';
// import { PromMethodCounter, InjectCounterMetric, CounterMetric } from '@digikare/nestjs-prom';
import { BlogDataLoader } from '../dataloaders/blog.dataloader';
import { CategoryRepository } from '../../category/repositories/category.repository';

@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogRepository, private readonly blogDataLoader: BlogDataLoader, private readonly categoryRepository: CategoryRepository) {}

  findOneOrFail = (data: FindOneOptions<BlogEntity>) => this.blogRepository.findOneOrFail(data);

  // @PromMethodCounter
  async pagination({ limit, page }: { limit?: number; page?: number }): Promise<BlogConnection> {
    const query = this.blogRepository.createQueryBuilder('blogs');
    // { order: { id: 'DESC' }
    return this.blogRepository.customPaginate(query, { limit, page });
  }

  create = (data: Partial<BlogEntity>): Promise<BlogEntity> => {
    const blog = new BlogEntity(data);
    return this.blogRepository.save(blog);
  };

  async findById(id: string) {
    return this.blogDataLoader.load(id);
  }

  async update(id: string, data: Partial<BlogEntity>) {
    await this.blogRepository.update(id, data);
    return this.blogRepository.findOne(data.id);
  }

  async paginationCursors({ slug, limit, page, title }: { slug?: string; limit?: number; page?: number, title?: string }) {
    const category = await this.categoryRepository.findOne({ id: slug });
    if(category) {
      const query = this.blogRepository.createQueryBuilder('blogs').innerJoinAndSelect("blogs.blogcates", "categories")
      .andWhere(`categories.id = :slug`, {slug})
      .where("blogs.title ILIKE :title", {title: `%${ title }%` })
      .andWhere(`blogs.views Between ${1} AND ${2}`)
      // .andWhere(`blogs.views >= 1`)
      // .andWhere(`blogs.views < 2`)
      .orderBy("blogs.id", "DESC")
      return this.blogRepository.customPaginate(query, { limit, page });
    }
    // search by like, category, order, size 
    // const ids = [slug];
    // const query = this.blogRepository.creatQeueryBuilder('blogs').leftJoinAndSelect("blogs.blogcates", "categories");
    // .where("categories.id IN (:...ids)", { ids: ids })
    // blogRepository
  }

  // Remove blog
  removeBlog = async (id: number | string) => {
    try {
      await this.blogRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };
}
