import { Module } from '@nestjs/common';
import { ProductCate, ProductCateAccess } from './entities/productcate.entity';
import { ProductCateRepository } from './repositories/productcate.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCateDataLoader } from './dataloaders/productcate.dataloader';
import { ProductCateResolver } from './resolvers/productcate.resolver';
import { ProductCateService } from './services/productcate.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([ProductCate, ProductCateAccess, ProductCateRepository])],
  providers: [ProductCateDataLoader, ProductCateResolver, ProductCateService],
  exports: [ProductCateDataLoader],
})
export class ProductcateModule {}
