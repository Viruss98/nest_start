import { MinLength, MaxLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';

@InputType()
export class NewCategoryInput {
  @MinLength(3)
  @MaxLength(50)
  title: string;
}

@InputType()
export class UpdateCategoryInput {
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  id: string;
}
