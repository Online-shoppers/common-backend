import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

export class CreateCartProductForm {
  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsEnum(ProductCategories)
  @ApiProperty()
  schema?: ProductCategories;

  @IsInt()
  @ApiProperty()
  quantity?: number;
}
