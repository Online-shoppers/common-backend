import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

import { ProductEntity } from 'app/products/entities/product.entity';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { ProductCategories } from '../enums/product-categories.enum';
import { ProductTypes } from '../enums/product-types.enum';

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
  @IsEnum(ProductCategories)
  category: ProductCategories;

  @ApiProperty()
  @IsNumber()
  rating: number;

  @ApiProperty()
  @IsInt()
  reviews_amount: number;

  @ApiProperty()
  @IsEnum(ProductTypes)
  type: ProductTypes;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  public static async fromEntity(entity: ProductEntity) {
    const it = new ProductDTO();

    const [rating, reviewsAmount] = await Promise.all([
      await entity.rating(),
      await entity.reviewsAmount(),
    ]);

    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.description = entity.description;
    it.category = entity.category;
    it.rating = rating;
    it.reviews_amount = reviewsAmount;
    it.image_url = entity.image_url;
    it.price = entity.price;
    it.quantity = entity.quantity;
    it.archived = entity.archived;

    return it;
  }

  public static async fromEntities(entities?: ProductEntity[]) {
    if (!Array.isArray(entities)) {
      return Promise.all([]);
    }

    return Promise.all(entities.map(entity => this.fromEntity(entity)));
  }
}
