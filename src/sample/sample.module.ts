import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleRepository } from './repositories/sample.repository';
import { SampleDataLoader } from './dataloaders/sample.dataloader';
import { SampleService } from './services/sample.service';
import { SampleQueryResolver } from './resolvers/sample_query.resolver';
import { SampleMutationResolver } from './resolvers/sample_mutation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SampleRepository])],
  providers: [
    // Resolver
    SampleQueryResolver,
    SampleMutationResolver,

    // DataLoader
    SampleDataLoader,

    // Service
    SampleService,
  ],
  exports: [SampleDataLoader, SampleService],
})
export class SampleModule {}
