import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, validate } from 'class-validator';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { OrderStatuses } from '../enums/order-statuses.enum';

export class NewOrderForm {
  @ApiProperty()
  @IsEnum(OrderStatuses, { message: ErrorCodes.FieldShouldBeEnum })
  status: OrderStatuses;

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

  @ApiProperty()
  @IsString()
  buyerId: string;
  static from(form: NewOrderForm) {
    const it = new NewOrderForm();
    it.status = form.status;
    it.country = form.country;
    it.city = form.city;
    it.zipCode = form.zipCode;
    it.address = form.address;
    it.phone = form.phone;
    it.buyerId = form.buyerId;
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
