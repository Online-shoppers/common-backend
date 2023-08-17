import { ApiProperty } from '@nestjs/swagger';
import { IsString, validate } from 'class-validator';

export class EditOrderForm {
  // @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  // email!: string;

  @ApiProperty()
  @IsString()
  status: string;

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
