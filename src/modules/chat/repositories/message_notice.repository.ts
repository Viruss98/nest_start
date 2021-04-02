import { CommonRepository } from 'src/modules/common/common.repository';
import { EntityRepository } from 'typeorm';
import { MessageNotice } from '../entities/message_notice.entity';

@EntityRepository(MessageNotice)
export class MessageNoticesRepository extends CommonRepository<MessageNotice> {}
