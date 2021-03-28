import { Validate, MinLength } from 'class-validator';
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

  views: number;

  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
  categories: string[];
}
