import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { ProductTypes } from 'shared/enums/productTypes.enum';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDDto } from './uuid.dto';

export class ProductDTO extends UUIDDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  image_url: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsEnum(ProductCategory)
  category: ProductCategory;

  @ApiProperty()
  @IsEnum(ProductTypes)
  type: ProductTypes;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
