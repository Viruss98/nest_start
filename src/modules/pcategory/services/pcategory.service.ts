import { Injectable } from '@nestjs/common';
import { PCategoryRepository } from '../repositories/pcategory.repository';
import { PCategory } from '../entities/pcategory.entity';
import { PCategoryDataLoader } from '../dataloaders/pcategory.dataloader';

interface SearchResponse<T> {
  hits: {
    hits: Array<{
      _source: T;
    }>;
  };
}

@Injectable()
export class PCategoryService {
  constructor(
    private readonly pcategoryRepository: PCategoryRepository,
    private readonly pcategoryDataloader: PCategoryDataLoader,
  ) {}

  async findById(id: string) {
    return this.pcategoryDataloader.load(id);
  }
  async create(data: Partial<PCategory>) {
    const item = this.pcategoryRepository.create(data);
    return await this.pcategoryRepository.save(item);
  }

  async update(id: string, data: Partial<PCategory>) {
    await this.pcategoryRepository.update(id, data);
    return this.pcategoryRepository.findOne(data.id);
  }

  async paginationCursor({ limit, page }: { limit?: number; page?: number }) {
    return this.pcategoryRepository.paginate(
      {
        limit,
        page,
      },
      {
        order: {
          id: 'DESC',
        },
      },
    );
  }

  // Remove category
  removePCategory = async (id: number | string) => {
    try {
      await this.pcategoryRepository.softDelete(id);
      return true;
    } catch (error) {
      return false;
    }
  };

}
