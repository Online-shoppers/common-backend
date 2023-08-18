import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

import { ProductCategory } from '../../shared/enums/productCategory.enum';
import { UUIDDto } from './uuid.dto';

export class ProductDTO extends UUIDDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
