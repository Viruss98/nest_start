import { Injectable } from '@nestjs/common';
import { ProductCateRepository } from '../repositories/productcate.repository';
import { ProductCate } from '../entities/productcate.entity';
import { ProductCateDataLoader } from '../dataloaders/productcate.dataloader';

interface SearchResponse<T> {
  hits: {
    hits: Array<{
      _source: T;
    }>;
  };
}

@Injectable()
export class ProductCateService {
  constructor(
    private readonly productcateRepository: ProductCateRepository,
    private readonly productcateDataloader: ProductCateDataLoader,
  ) {}

  async findById(id: string) {
    return this.productcateDataloader.load(id);
  }
  async create(data: Partial<ProductCate>) {
    const item = this.productcateRepository.create(data);
    return await this.productcateRepository.save(item);
  }

  async update(id: string, data: Partial<ProductCate>) {
    await this.productcateRepository.update(id, data);
    return this.productcateRepository.findOne(data.id);
  }

  async paginationCursor({ limit, page }: { limit?: number; page?: number }) {
    return this.productcateRepository.paginate(
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
  removeProductCate = async (id: number | string) => {
    try {
      await this.productcateRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };

}
