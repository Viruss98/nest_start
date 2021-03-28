import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { BlogsService } from 'src/modules/blogs/services/blogs.service';

@ValidatorConstraint({ async: true, name: 'UniqueTitle' })
@Injectable()
export class UniqueTitle implements ValidatorConstraintInterface {
  constructor(protected readonly blogService: BlogsService) {}
  async validate(value: string, args: ValidationArguments): Promise<boolean> {
    try {
      await this.blogService.findOneOrFail({
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
