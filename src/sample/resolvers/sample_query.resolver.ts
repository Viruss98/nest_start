import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { Sample, SampleConnection } from '../entities/sample.entity';
import { SampleService } from '../services/sample.service';
import { SampleDataLoader } from '../dataloaders/sample.dataloader';
import { PaginationArgs } from 'src/graphql/types/common.args';

@Resolver(() => Sample)
export class SampleQueryResolver {
  constructor(private readonly sampleService: SampleService, private readonly sampleDataLoader: SampleDataLoader) {}

  @Query(() => Sample, {
    nullable: true,
    description: 'Get Sample by Id',
  })
  async sample(@Args({ name: 'id', type: () => ID }) id: string): Promise<Sample> {
    return await this.sampleDataLoader.load(id);
  }

  @Query(() => SampleConnection, { nullable: true })
  async samples(@Args() data: PaginationArgs): Promise<SampleConnection> {
    return this.sampleService.pagination(data);
  }
}
