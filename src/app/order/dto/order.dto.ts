import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

import { OrderProductDTO } from 'app/order-item/dto/order-product.dto';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { OrderEntity } from '../entities/order.entity';

export class OrderDTO extends UUIDDto {
  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNumber()
  total: number;

  @ApiProperty({ type: OrderProductDTO, isArray: true })
  @IsArray({ context: OrderProductDTO })
  products: OrderProductDTO[];

  @ApiProperty()
  @IsString()
  buyerId: string;

  static async fromEntity(entity?: OrderEntity) {
    if (!entity) {
      return;
    }

    if (!entity.orderProducts.isInitialized()) {
      await entity.orderProducts.init();
    }

    const it = new OrderDTO();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.status = entity.status;
    it.country = entity.country;
    it.city = entity.city;
    it.zipCode = entity.zipCode;
    it.address = entity.address;
    it.total = await entity.getTotal();
    it.phone = entity.phone;
    it.buyerId = entity.buyer.id;
    it.products = OrderProductDTO.fromEntities(entity.orderProducts.getItems());

    return it;
  }

  static async fromEntities(entities?: OrderEntity[]) {
    if (!Array.isArray(entities)) {
      return;
    }

    return Promise.all(entities.map(entity => this.fromEntity(entity)));
  }
}
