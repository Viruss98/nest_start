import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { MediaEntity } from '../entities/media.entity';
import { MediaRepository } from '../repositories/media.repository';

@Injectable({
  scope: Scope.DEFAULT,
})
export class MediaDataLoader extends DataLoader<string, MediaEntity> {
  constructor(private readonly mediaRepository: MediaRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.mediaRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) ?? new Error('Not found'));
    });
  }
}
