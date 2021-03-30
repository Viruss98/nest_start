import DataLoader from 'dataloader';
import { ProductCate } from '../entities/productcate.entity';
import { Injectable, Scope } from '@nestjs/common';
import { ProductCateRepository } from '../repositories/productcate.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class ProductCateDataLoader extends DataLoader<string, ProductCate> {
  constructor(private readonly productCateRepository: ProductCateRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.productCateRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
