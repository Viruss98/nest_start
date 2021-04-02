import { Args, Query, Resolver } from '@nestjs/graphql';
// import { CurrentUser, AuthJwt } from 'src/decorators/common.decorator';
// import { User } from '../../users/entities/users.entity';
import { MediaArgs } from '../dto/media.args';
import { MediaEntity } from '../entities/media.entity';
import { MediaService } from '../services/media.service';
import { MediaConnection } from '../entities/media.entity';

@Resolver(() => MediaEntity)
export class MediaQueriesResolver {
  constructor(private readonly mediaService: MediaService) {}

  @Query(() => MediaConnection, {
    nullable: true,
    name: 'medias',
  })
  // @AuthJwt()
  async medias(@Args() args: MediaArgs) {
    return this.mediaService.pagination({
      page: args.page,
      limit: args.limit,
    });
  }
}
