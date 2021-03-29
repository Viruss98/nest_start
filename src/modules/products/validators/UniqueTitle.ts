import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/modules/products/services/products.service';

@ValidatorConstraint({ async: true, name: 'UniqueTitle' })
@Injectable()
export class UniqueTitle implements ValidatorConstraintInterface {
  constructor(protected readonly productService: ProductsService) {}
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    try {
      await this.productService.findOneOrFail({
        where: {
          title: value,
        },
      });
      return false;
    } catch (err) {
      return true;
    }
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is too short or too long!';
  }
}
