import { EntityRepository } from 'typeorm';
import { CommonRepository } from 'src/modules/common/common.repository';
import { Sample } from '../entities/sample.entity';

@EntityRepository(Sample)
export class SampleRepository extends CommonRepository<Sample> {}
