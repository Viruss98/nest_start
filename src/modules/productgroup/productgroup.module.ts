import { Module } from '@nestjs/common';
import { ProductGroup, ProductGroupAccess } from './entities/productgroup.entity';
import { ProductGroupRepository } from './repositories/productgroup.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductGroupDataLoader } from './dataloaders/productgroup.dataloader';
import { ProductGroupResolver } from './resolvers/productgroup.resolver';
import { ProductGroupService } from './services/productgroup.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ProductGroup, ProductGroupAccess, ProductGroupRepository])],
  providers: [ProductGroupDataLoader, ProductGroupResolver, ProductGroupService],
  exports: [ProductGroupDataLoader],
})
export class ProductgroupModule {}
