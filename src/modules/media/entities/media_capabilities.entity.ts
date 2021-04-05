import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class MediaCapability {
  @Field()
  canCopy?: boolean;

  @Field()
  canDelete?: boolean;

  @Field()
  canDownload?: boolean;

  @Field()
  canEdit?: boolean;

  @Field()
  canRename?: boolean;
}
