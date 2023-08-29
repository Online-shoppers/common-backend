import { Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString, IsUrl } from 'class-validator';

import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { CartProductEntity } from '../entities/cart-product.entity';

export class CartProductDto extends UUIDDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsUrl()
  @ApiProperty()
  imageUrl: string;

  @IsEnum(ProductCategories)
  @ApiProperty()
  category: ProductCategories;

  @IsInt()
  @ApiProperty()
  quantity!: number;

  @IsNumber()
  @ApiProperty()
  unitPrice!: number;

  @IsString()
  @ApiProperty()
  productId!: string;

  static fromEntity(entity?: CartProductEntity) {
    if (!entity) {
      return;
    }
    const it = new CartProductDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.imageUrl = entity.product.image_url;
    it.description = entity.description;
    it.category = entity.category;
    it.quantity = entity.quantity;
    it.unitPrice = entity.unitPrice();
    it.productId = entity.product.id;

    return it;
  }

  static fromEntities(entities?: CartProductEntity[]) {
    if (!Array.isArray(entities)) {
      return [];
    }

    return entities.map(entity => CartProductDto.fromEntity(entity));
  }

  static async fromCollection(collection?: Collection<CartProductEntity>) {
    if (!collection.isInitialized()) {
      await collection.init();
    }

    return collection
      .getItems()
      .map(entity => CartProductDto.fromEntity(entity));
  }
}
