import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { BeerType } from '../enums/beerType.enum';

export class NewBeerForm {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  image_url: string;

  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  abv: number;

  @ApiProperty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsNumber()
  ibu: number;

  @ApiProperty()
  @IsEnum(BeerType)
  type: BeerType;
}
