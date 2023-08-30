import { ApiProperty } from '@nestjs/swagger';
import { IsString, validate } from 'class-validator';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

export class NewOrderForm {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  city: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  zipCode: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  address: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  phone: string;

  static from(form: NewOrderForm) {
    const it = new NewOrderForm();
    it.country = form.country;
    it.city = form.city;
    it.zipCode = form.zipCode;
    it.address = form.address;
    it.phone = form.phone;

    return it;
  }

  static async validate(form: NewOrderForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
