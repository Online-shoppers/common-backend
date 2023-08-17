import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { ProductCategory } from '../../shared/enums/productCategory.enum';
import { ProductType } from '../../shared/enums/productType.enum';
import { UUIDDto } from './uuid.dto';

export class ProductDTO extends UUIDDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsEnum(ProductType)
  type: ProductType;

  @IsNumber()
  weight: number;

  @IsNumber()
  volume: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
