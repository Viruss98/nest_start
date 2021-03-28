import { Field, InputType } from '@nestjs/graphql';
import { FilterOperatorTypeEnum, FilterFieldTypeEnum } from '../enums/filter_operator_type';

@InputType()
export class FilterInput {
  @Field()
  field: string;

  @Field(() => FilterOperatorTypeEnum)
  operator: FilterOperatorTypeEnum;

  @Field(() => FilterFieldTypeEnum, {
    defaultValue: FilterFieldTypeEnum.STRING,
  })
  type: FilterFieldTypeEnum;

  @Field()
  value: string;
}

@InputType()
export class SortInput {
  @Field()
  field: string;
  @Field()
  direction?: string;
}
