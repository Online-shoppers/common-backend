import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validate,
} from 'class-validator';

import { ProductTypes } from 'app/products/enums/product-types.enum';

import { AccessoryTypes } from '../enums/accessory-types.enum';

export class CreateAccessoryForm {
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
  @IsEnum(AccessoryTypes)
  type: ProductTypes;

  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: CreateAccessoryForm) {
    const it = new CreateAccessoryForm();

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

  static async validate(form: CreateAccessoryForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
