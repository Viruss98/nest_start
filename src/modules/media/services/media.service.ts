import { Injectable } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { MediaEntity } from '../entities/media.entity';
import { DeepPartial } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  addMedia = async (data: DeepPartial<MediaEntity>, parentId?: number | string) => {
    const media = this.mediaRepository.create(data);
    return await this.mediaRepository.save(media);
  };

  // removeMedia = async (id: number | string) => {
  //   const media = await this.mediaRepository.findOneOrFail(id, {
  //     where: {
  //       isDeleted: false,
  //     },
  //   });
  //   media.isDeleted = true;
  //   return this.mediaRepository.save(media);
  // };
  removeMedia = async (id: number | string) => {
    try {
      await this.mediaRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };

  updateMedia = async (data: { id: string; name: string }) => {
    await this.mediaRepository.update(data.id, { name: data.name });
    return this.mediaRepository.findOneOrFail(data.id);
  };

  async pagination({ page, limit }: { page?: number; limit?: number }) {
    return this.mediaRepository.paginate({ page, limit });
  }
}
