import DataLoader from 'dataloader';
import { PCategory } from '../entities/pcategory.entity';
import { Injectable, Scope } from '@nestjs/common';
import { PCategoryRepository } from '../repositories/pcategory.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class PCategoryDataLoader extends DataLoader<string, PCategory> {
  constructor(private readonly pcategoryRepository: PCategoryRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.pcategoryRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
