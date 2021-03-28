import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogsService } from './services/blogs.service';
import { BlogRepository } from './repositories/blog.repository';
import { UniqueTitle } from './validators/UniqueTitle';
import { BlogDataLoader } from './dataloaders/blog.dataloader';
import { CategoryModule } from '../category/category.module';
import { BlogsQueryResolver } from './resolvers/blogs_query.resolver';
import { BlogsMutationResolver } from './resolvers/blogs_mutation.resolver';
import { BlogsFieldsResolver } from './resolvers/blogs_fields.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([BlogEntity, BlogRepository]), CategoryModule],
  providers: [
    UniqueTitle,

    // Resolver
    BlogsQueryResolver,
    BlogsMutationResolver,
    BlogsFieldsResolver,

    // DataLoader
    BlogDataLoader,

    // Service
    BlogsService,
    // AudioService,

    // Processor
    // AudioProcessor,
  ],
  exports: [
    BlogDataLoader,
    BlogsService,
    // AudioService
  ],
})
export class BlogsModule {}
