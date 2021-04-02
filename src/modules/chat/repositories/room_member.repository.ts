import { CommonRepository } from 'src/modules/common/common.repository';
import { EntityRepository } from 'typeorm';
import { RoomMember } from './../entities/room_member.entity';

@EntityRepository(RoomMember)
export class RoomMemberRepository extends CommonRepository<RoomMember> {}
