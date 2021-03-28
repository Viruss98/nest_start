import { ArgsType, Field, ID } from '@nestjs/graphql';

@ArgsType()
export class CreateDirArgs {
  @Field(() => ID, {
    nullable: true,
  })
  parentId?: string;

  dirName: string;
}
