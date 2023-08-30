import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UUIDDto } from '../../../shared/dtos/uuid.dto';
import { OrderProductEntity } from '../entity/order-product.entity';

export class OrderProductDTO extends UUIDDto {
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
  orderId: string;

  static fromEntity(entity?: OrderProductEntity) {
    if (!entity) {
      return;
    }

    const it = new OrderProductDTO();

    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.description = entity.description;
    it.price = entity.price;
    it.orderId = entity.order.id;

    return it;
  }

  static fromEntities(entities?: OrderProductEntity[]) {
    if (!Array.isArray(entities)) {
      return [];
    }

    return entities.map(entity => this.fromEntity(entity));
  }
}
