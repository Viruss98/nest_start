import { EntityRepository } from 'typeorm';
import { User } from '../entities/users.entity';
import { CommonRepository } from 'src/modules/common/common.repository';

@EntityRepository(User)
export class UserRepository extends CommonRepository<User> {}
