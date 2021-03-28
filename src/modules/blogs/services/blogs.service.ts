import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { BlogRepository } from '../repositories/blog.repository';
import { BlogEntity } from '../entities/blog.entity';
import { BlogConnection } from '../entities/blog_connection.entity';
// import { PromMethodCounter, InjectCounterMetric, CounterMetric } from '@digikare/nestjs-prom';

@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogRepository) {}

  findOneOrFail = (data: FindOneOptions<BlogEntity>) => this.blogRepository.findOneOrFail(data);

  // @PromMethodCounter
  pagination(data: { limit: number; orderDirection?: 'ASC' | 'DESC' }): Promise<BlogConnection> {
    return this.blogRepository.paginate({ limit: data.limit, page: 1 });
  }

  create = (data: Partial<BlogEntity>): Promise<BlogEntity> => {
    const blog = new BlogEntity(data);
    return this.blogRepository.save(blog);
  };
}
