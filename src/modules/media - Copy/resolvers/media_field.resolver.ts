import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
// import { CurrentUser } from 'src/decorators/common.decorator';
import { UserDataLoader } from 'src/modules/users/dataloaders/users.dataloader';
import { User } from 'src/modules/users/entities/users.entity';
import { MediaEntity } from '../entities/media.entity';
import { MediaCapability } from '../entities/media_capabilities.entity';

@Resolver(() => MediaEntity)
export class MediaFieldResolver {
  constructor(private readonly userDataLoader: UserDataLoader) {}

  @ResolveField(() => String, {
    nullable: true,
  })
  filePath(@Parent() media: MediaEntity) {
    if (media.type === 'dir') return '';
    return media.filePath?.startsWith('http')
      ? media.filePath
      : `${process.env.DASHBOARD_DOMAIN ?? ''}/${media.filePath ?? ''}`;
  }

  @ResolveField(() => User, {
    nullable: true,
  })
  owner(@Parent() media: MediaEntity) {
    if (media.ownerId) return this.userDataLoader.load(media.ownerId);
    return null;
  }

  @ResolveField(() => MediaCapability, {
    nullable: true,
  })
  capabilities() {
    return {
      canEdit: true,
      canDelete: true,
    };
  }
}
