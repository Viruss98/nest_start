import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { Category } from '../entities/category.entity';
import { CategoryDataLoader } from '../dataloaders/category.dataloader';

interface SearchResponse<T> {
  hits: {
    hits: Array<{
      _source: T;
    }>;
  };
}

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryDataloader: CategoryDataLoader,
  ) {}

  async findById(id: string) {
    return this.categoryDataloader.load(id);
  }
  async create(data: Partial<Category>) {
    const item = this.categoryRepository.create(data);
    return await this.categoryRepository.save(item);
  }

  async update(id: string, data: Partial<Category>) {
    await this.categoryRepository.update(id, data);
    return this.categoryRepository.findOne(data.id);
  }

  async paginationCursor({ limit, page }: { limit?: number; page?: number }) {
    const query = this.categoryRepository.createQueryBuilder('categories');
    // { order: { id: 'DESC' }
    return this.categoryRepository.customPaginate(query, { limit, page });
    // return this.categoryRepository.paginate(
    //   {
    //     limit,
    //     page,
    //   },
    //   {
    //     order: {
    //       id: 'DESC',
    //     },
    //   },
    // );
  }

  // Remove category
  removeCategory = async (id: number | string) => {
    try {
      await this.categoryRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };

}
