import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { CartEntity } from '../entities/cart.entity';

export class CartDto extends UUIDDto {
  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty({ type: CartProductDto, isArray: true })
  @IsArray()
  products: CartProductDto[];

  static async fromEntity(entity?: CartEntity) {
    if (!entity.products.isInitialized()) {
      await entity.products.init();
    }

    const it = new CartDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.total = await entity.total();
    it.products = await CartProductDto.fromCollection(entity.products);

    return it;
  }

  static fromEntities(entities?: CartEntity[]) {
    if (!Array.isArray(entities)) {
      return;
    }

    return entities.map(entity => this.fromEntity(entity));
  }
}
