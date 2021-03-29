import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { ProductRepository } from '../repositories/product.repository';
import { ProductEntity } from '../entities/products.entity';
import { ProductConnection } from '../entities/products_connection.entity';
// import { PromMethodCounter, InjectCounterMetric, CounterMetric } from '@digikare/nestjs-prom';
import { ProductDataLoader } from '../dataloaders/product.dataloader';

@Injectable()
export class ProductsService {
  constructor(private readonly productRepository: ProductRepository,private readonly productDataLoader: ProductDataLoader) {}

  findOneOrFail = (data: FindOneOptions<ProductEntity>) => this.productRepository.findOneOrFail(data);

  // @PromMethodCounter
  pagination({ limit, page }: { limit?: number; page?: number }): Promise<ProductConnection> {
    return this.productRepository.paginate({
      limit,
      page,
    },
    {
      order: {
        id: 'DESC',
      },
    });
  }
  create = (data: Partial<ProductEntity>): Promise<ProductEntity> => {
    const product = new ProductEntity(data);
    return this.productRepository.save(product);
  };

  async findById(id: string) {
    return this.productDataLoader.load(id);
  }

  async update(id: string, data: Partial<ProductEntity>) {
    await this.productRepository.update(id, data);
    return this.productRepository.findOne(data.id);
  }

  // Remove product
  removeProduct = async (id: number | string) => {
    try {
      await this.productRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };
}
