import DataLoader from 'dataloader';
import { ProductGroup } from '../entities/productgroup.entity';
import { Injectable, Scope } from '@nestjs/common';
import { ProductGroupRepository } from '../repositories/productgroup.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class ProductGroupDataLoader extends DataLoader<string, ProductGroup> {
  constructor(private readonly productGroupRepository: ProductGroupRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.productGroupRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
