import { EntityRepository } from 'typeorm';
import { CommonRepository } from 'src/modules/common/common.repository';
import { AuthTokenEntity } from '../entities/auth.entity';

@EntityRepository(AuthTokenEntity)
export class AuthRepository extends CommonRepository<AuthTokenEntity> {}
