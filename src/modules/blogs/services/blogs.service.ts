import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogEntity } from '../entities/blog.entity';
import { BlogConnection } from '../entities/blog_connection.entity';
// import { PromMethodCounter, InjectCounterMetric, CounterMetric } from '@digikare/nestjs-prom';
import { BlogDataLoader } from '../dataloaders/blog.dataloader';

@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogRepository,private readonly blogDataLoader: BlogDataLoader) {}

  findOneOrFail = (data: FindOneOptions<BlogEntity>) => this.blogRepository.findOneOrFail(data);

  // @PromMethodCounter
  pagination({ limit, page }: { limit?: number; page?: number }): Promise<BlogConnection> {
    return this.blogRepository.paginate({
      limit,
      page,
    },
    {
      order: {
        id: 'DESC',
      },
    });
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
