import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, validate } from 'class-validator';

import { OrderStatuses } from 'shared/enums/order-statuses.enum';

export class EditOrderForm {
  @ApiProperty()
  @IsEnum(OrderStatuses)
  status: OrderStatuses;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  static from(form: EditOrderForm) {
    const it = new EditOrderForm();
    it.status = form.status;
    it.country = form.country;
    it.city = form.city;
    it.zipCode = form.zipCode;
    it.address = form.address;
    it.phone = form.phone;
    return it;
  }

  static async validate(form: EditOrderForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
