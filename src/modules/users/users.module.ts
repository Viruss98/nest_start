import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/users.repository';
import { User } from './entities/users.entity';
import { UsersResolver } from './resolvers/users.resolver';
import { UserDataLoader } from './dataloaders/users.dataloader';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository])],
  providers: [UserDataLoader, UsersService, UsersResolver],
  exports: [UsersService, UserDataLoader],
})
export class UsersModule {}
