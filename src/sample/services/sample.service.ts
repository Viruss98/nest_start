import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import { SampleRepository } from '../repositories/sample.repository';
import { Sample, SampleConnection } from '../entities/sample.entity';
import { PaginationArgs } from 'src/graphql/types/common.args';

@Injectable()
export class SampleService {
  constructor(private readonly sampleRepository: SampleRepository) {}

  findOneOrFail = (data: FindOneOptions<Sample>): Promise<Sample> => this.sampleRepository.findOneOrFail(data);
  pagination = async (data: PaginationArgs): Promise<SampleConnection> => {
    return this.sampleRepository.paginate(data);
  };

  create(data: Partial<Sample>): Promise<Sample> {
    const entity = new Sample(data);
    return this.sampleRepository.save(entity);
  }

  async update(id: string, data: Partial<Sample>): Promise<Sample> {
    await this.sampleRepository.update(id, data);
    return this.sampleRepository.findOneOrFail(id);
  }

  async remove(id: string): Promise<boolean> {
    await this.sampleRepository.delete(id);
    return true;
  }
}
