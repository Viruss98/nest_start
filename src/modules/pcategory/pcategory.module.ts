import { Module } from '@nestjs/common';
import { PCategory, PCategoryAccess } from './entities/pcategory.entity';
import { PCategoryRepository } from './repositories/pcategory.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PCategoryDataLoader } from './dataloaders/pcategory.dataloader';
import { PCategoryResolver } from './resolvers/pcategory.resolver';
import { PCategoryService } from './services/pcategory.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([PCategory, PCategoryAccess, PCategoryRepository])],
  providers: [PCategoryDataLoader, PCategoryResolver, PCategoryService],
  exports: [PCategoryDataLoader],
})
export class PcategoryModule {}
