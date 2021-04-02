import { Injectable, NotFoundException } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Room } from '../entities/room.entity';
import { RoomRepository } from '../repositories/room.repository';

@Injectable()
export class RoomDataLoader extends DataLoader<string, Room> {
    constructor(private readonly roomRepository: RoomRepository) {
        super(
            async (ids) => {
                const rows = await this.roomRepository.findByIds([...ids]);
                return ids.map((id) => rows.find((x) => x.id === id) ?? new NotFoundException('Room Not found'));
            },
            { cache: true },
        );
    }
}
