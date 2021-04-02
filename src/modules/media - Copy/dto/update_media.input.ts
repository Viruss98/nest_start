import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateMediaInput {
  @Field(() => ID, {
    nullable: false,
  })
  id: string;

  name: string;
}
