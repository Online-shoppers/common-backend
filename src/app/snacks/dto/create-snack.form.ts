import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validate,
} from 'class-validator';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { SnackTypes } from '../enums/snack-types.enum';

export class CreateSnackForm {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  image_url: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsEnum(SnackTypes)
  type: ProductTypes;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  @ApiProperty()
  @IsNumber()
  weight: number;

  static from(form: CreateSnackForm) {
    const it = new CreateSnackForm();

    it.name = form.name;
    it.type = form.type;
    it.description = form.description;
    it.price = form.price;
    it.quantity = form.quantity;
    it.weight = form.weight;
    it.image_url = form.image_url;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: CreateSnackForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
