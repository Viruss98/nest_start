import { InputType, PartialType } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
@InputType()
export class CreateSampleInput {
  title: string;

  content: string;
}

@InputType()
export class UpdateSampleInput extends PartialType(CreateSampleInput) {}
