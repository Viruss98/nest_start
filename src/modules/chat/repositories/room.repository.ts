import { CommonRepository } from 'src/modules/common/common.repository';
import { EntityRepository } from 'typeorm';
import { Room } from './../entities/room.entity';

@EntityRepository(Room)
export class RoomRepository extends CommonRepository<Room> {}
