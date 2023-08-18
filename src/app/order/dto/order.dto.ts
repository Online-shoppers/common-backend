import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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

  static fromEntity(entity?: OrderEntity) {
    if (!entity) {
      return;
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
    it.phone = entity.phone;

    return it;
  }

  static fromEntities(entities?: OrderEntity[]) {
    if (!Array.isArray(entities)) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
