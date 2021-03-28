import { Resolver, Args, Mutation, ID } from '@nestjs/graphql';
import { Sample } from '../entities/sample.entity';
import { SampleService } from '../services/sample.service';
import { CreateSampleInput } from '../dto/sample.input';

@Resolver(() => Sample)
export class SampleMutationResolver {
  constructor(private readonly sampleService: SampleService) {}

  @Mutation(() => Sample)
  async createSample(@Args('input') input: CreateSampleInput): Promise<Sample> {
    const entity = await this.sampleService.create(input);
    return entity;
  }

  @Mutation(() => Sample)
  async updateSample(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: CreateSampleInput,
  ): Promise<Sample> {
    return this.sampleService.update(id, input);
  }

  @Mutation(() => Boolean)
  async removeSample(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.sampleService.remove(id);
  }
}
