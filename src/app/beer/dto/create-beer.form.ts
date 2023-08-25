import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  validate,
} from 'class-validator';

import { ProductTypes } from 'app/products/enums/product-types.enum';

import { BeerTypes } from '../enums/beer-types.enum';

export class CreateBeerForm {
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
  @IsEnum(BeerTypes)
  type: ProductTypes;

  @ApiProperty()
  @IsNumber()
  abv: number;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsNumber()
  ibu: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: CreateBeerForm) {
    const it = new CreateBeerForm();

    it.name = form.name;
    it.type = form.type;
    it.description = form.description;
    it.price = form.price;
    it.quantity = form.quantity;
    it.abv = form.abv;
    it.country = form.country;
    it.volume = form.volume;
    it.ibu = form.ibu;
    it.image_url = form.image_url;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: CreateBeerForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
