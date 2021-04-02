import { CommonRepository } from 'src/modules/common/common.repository';
import { EntityRepository } from 'typeorm';
import { Message } from '../entities/message.entity';

@EntityRepository(Message)
export class MessageRepository extends CommonRepository<Message> {}
