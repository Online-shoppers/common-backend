import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, validate } from 'class-validator';

export class FilterProductsForm {
  @Optional()
  @ApiProperty()
  @IsString()
  name: string;

  public static from(form: FilterProductsForm) {
    const it = new FilterProductsForm();

    it.name = form.name;

    return it;
  }

  public static async validate(form: FilterProductsForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
