import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { UUIDDto } from 'shared/dtos/uuid.dto';

import { CartEntity } from '../entities/cart.entity';

export class CartInfoDto extends UUIDDto {
  @ApiProperty()
  @IsNumber()
  total: number;

  static async fromEntity(entity?: CartEntity) {
    if (!entity.products.isInitialized()) {
      await entity.products.init();
    }

    const it = new CartInfoDto();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.total = await entity.total();

    return it;
  }
}
