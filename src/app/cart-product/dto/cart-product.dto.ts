import { Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsString } from 'class-validator';

import { UUIDDto } from 'shared/dtos/uuid.dto';
import { ProductCategory } from 'shared/enums/productCategory.enum';

import { CartProductEntity } from '../entities/cart-product.entity';

export class CartProductDto extends UUIDDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  description: string;

  @IsEnum(ProductCategory)
  @ApiProperty()
  category: ProductCategory;

  @IsInt()
  @ApiProperty()
  quantity!: number;

  @IsNumber()
  @ApiProperty()
  unitPrice!: number;

  static fromEntity(entity?: CartProductEntity) {
    if (!entity) {
      return;
    }
    const it = new CartProductDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.description = entity.description;
    it.category = entity.category;
    it.quantity = entity.quantity;
    it.unitPrice = entity.unitPrice();

    return it;
  }

  static fromEntities(entities?: CartProductEntity[]) {
    if (!Array.isArray(entities)) {
      return [];
    }

    return entities.map(entity => CartProductDto.fromEntity(entity));
  }

  static async fromCollection(collection?: Collection<CartProductEntity>) {
    await collection.init();

    return collection
      .getItems(false)
      .map(entity => CartProductDto.fromEntity(entity));
  }
}
