import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

import { ProductCategory } from 'shared/enums/productCategory.enum';

export class CreateCartProductForm {
  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsEnum(ProductCategory)
  @ApiProperty()
  schema?: ProductCategory;

  @IsInt()
  @ApiProperty()
  quantity?: number;
}
