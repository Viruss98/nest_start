import DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../entities/users.entity';

@Injectable({
  scope: Scope.REQUEST,
})
export class UserDataLoader extends DataLoader<string, User> {
  constructor(private readonly userRepository: UserRepository) {
    super(async (ids: ReadonlyArray<string>) => {
      const rows = await this.userRepository.findByIds([...ids]);
      return ids.map((id) => rows.find((x) => x.id == id) || new Error('Not found'));
    });
  }
}
