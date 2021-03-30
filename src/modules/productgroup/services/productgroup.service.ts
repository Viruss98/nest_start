import { Injectable } from '@nestjs/common';
import { ProductGroupRepository } from '../repositories/productgroup.repository';
import { ProductGroup } from '../entities/productgroup.entity';
import { ProductGroupDataLoader } from '../dataloaders/productgroup.dataloader';

interface SearchResponse<T> {
  hits: {
    hits: Array<{
      _source: T;
    }>;
  };
}

@Injectable()
export class ProductGroupService {
  constructor(
    private readonly productgroupRepository: ProductGroupRepository,
    private readonly productgroupDataloader: ProductGroupDataLoader,
  ) {}

  async findById(id: string) {
    return this.productgroupDataloader.load(id);
  }
  async create(data: Partial<ProductGroup>) {
    const item = this.productgroupRepository.create(data);
    return await this.productgroupRepository.save(item);
  }

  async update(id: string, data: Partial<ProductGroup>) {
    await this.productgroupRepository.update(id, data);
    return this.productgroupRepository.findOne(data.id);
  }

  async paginationCursor({ limit, page }: { limit?: number; page?: number }) {
    return this.productgroupRepository.paginate(
      {
        limit,
        page,
      },
      {
        order: {
          id: 'DESC',
        },
      },
    );
  }

  // Remove category
  removeProductGroup = async (id: number | string) => {
    try {
      await this.productgroupRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };

}
