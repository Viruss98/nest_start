import DataLoader from 'dataloader';
import { ProductEntity } from '../entities/products.entity';
import { Injectable, Scope } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class ProductDataLoader extends DataLoader<string, ProductEntity> {
  constructor(private readonly productRepository: ProductRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.productRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
