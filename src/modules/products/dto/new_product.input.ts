import { Validate, MinLength, MaxLength } from 'class-validator';
import { InputType } from '@nestjs/graphql';
import { UniqueTitle } from '../validators/UniqueTitle';
import { Injectable } from '@nestjs/common';

@Injectable()
@InputType()
export class NewProductInput {
  @MinLength(3)
  @Validate(UniqueTitle, {
    message: 'Title must be unique',
  })
  title: string;

  content: string;

}

@InputType()
export class UpdateProductInput {
  @MinLength(3)
  @MaxLength(50)
  title?: string;

  id: string;
}
