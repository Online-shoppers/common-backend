import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDDto } from './uuid.dto';

export class ProductDTO extends UUIDDto {
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

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
