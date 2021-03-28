import DataLoader from 'dataloader';
import { Category } from '../entities/category.entity';
import { Injectable, Scope } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class CategoryDataLoader extends DataLoader<string, Category> {
  constructor(private readonly categoryRepository: CategoryRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.categoryRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
