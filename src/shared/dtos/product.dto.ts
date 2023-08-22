import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

import { CategoryDescription } from 'shared/enums/categoryDescription.enum';
import { CategoryImage } from 'shared/enums/categoryImage.enum';

import { ProductCategory } from '../../shared/enums/productCategory.enum';
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

  @IsArray({ context: ProductCategory })
  category: ProductCategory[];

  @IsArray({ context: CategoryDescription })
  category_description: CategoryDescription[];

  @IsArray({ context: CategoryImage })
  category_image: CategoryImage[];

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
