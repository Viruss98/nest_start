import DataLoader from 'dataloader';
import { BlogEntity } from '../entities/blog.entity';
import { Injectable, Scope } from '@nestjs/common';
import { BlogRepository } from '../repositories/blog.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class BlogDataLoader extends DataLoader<string, BlogEntity> {
  constructor(private readonly blogRepository: BlogRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.blogRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
