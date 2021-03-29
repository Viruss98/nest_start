import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/products.entity';
import { ProductsService } from './services/products.service';
import { ProductRepository } from './repositories/product.repository';
import { UniqueTitle } from './validators/UniqueTitle';
import { ProductDataLoader } from './dataloaders/product.dataloader';
import { PcategoryModule } from '../pcategory/pcategory.module';
import { ProductsQueryResolver } from './resolvers/products_query.resolver';
import { ProductsMutationResolver } from './resolvers/products_mutation.resolver';
import { ProductsFieldsResolver } from './resolvers/products_fields.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductRepository]), PcategoryModule],
  providers: [
    UniqueTitle,

    // Resolver
    ProductsQueryResolver,
    ProductsMutationResolver,
    ProductsFieldsResolver,

    // DataLoader
    ProductDataLoader,

    // Service
    ProductsService,
    // AudioService,

    // Processor
    // AudioProcessor,
  ],
  exports: [
    ProductDataLoader,
    ProductsService,
    // AudioService
  ],
})
export class ProductsModule {}
