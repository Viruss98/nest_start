import { EntityRepository } from 'typeorm';
import { MediaEntity } from '../entities/media.entity';
import { CommonRepository } from '../../common/common.repository';

@EntityRepository(MediaEntity)
export class MediaRepository extends CommonRepository<MediaEntity> {}
