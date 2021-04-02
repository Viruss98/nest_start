import { Validate, MinLength, MaxLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { UniqueTitle } from '../validators/UniqueTitle';
import { Injectable } from '@nestjs/common';

@Injectable()
@InputType()
export class NewBlogInput {
  @MinLength(3)
  @Validate(UniqueTitle, {
    message: 'Title must be unique',
  })
  title: string;

  content: string;

  listIds: string[];
}

@InputType()
export class UpdateBlogInput {
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  id: string;

  listIds: string[];
}
