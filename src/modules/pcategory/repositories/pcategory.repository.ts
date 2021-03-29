import { EntityRepository } from 'typeorm';
import { PCategory } from '../entities/pcategory.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(PCategory)
export class PCategoryRepository extends CommonRepository<PCategory> {}
