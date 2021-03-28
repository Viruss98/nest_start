import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { Sample } from '../entities/sample.entity';
import { SampleRepository } from '../repositories/sample.repository';

@Injectable({
  scope: Scope.REQUEST,
})
export class SampleDataLoader extends DataLoader<any, Sample> {
  constructor(private readonly sampleRepository: SampleRepository) {
    super(async (ids) => {
      const rows = await this.sampleRepository.findByIds(ids as any[]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
