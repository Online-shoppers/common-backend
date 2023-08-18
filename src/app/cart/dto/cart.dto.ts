import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

import { CartProductDto } from 'app/cart-product/dto/cart-product.dto';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { CartEntity } from '../entities/cart.entity';

export class CartDto extends UUIDDto {
  @ApiProperty({ type: CartProductDto, isArray: true })
  @IsArray()
  products: CartProductDto[];

  static fromEntity(entity?: CartEntity) {
    if (!entity) {
      return;
    }
    const it = new CartDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.products = CartProductDto.fromEntities(entity.products);

    return it;
  }

  static fromEntities(entities?: CartEntity[]) {
    if (!Array.isArray(entities)) {
      return;
    }

    return entities.map(entity => this.fromEntity(entity));
  }
}
