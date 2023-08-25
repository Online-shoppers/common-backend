import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

import { ProductDTO } from 'app/products/dtos/product.dto';

import { AccessoryEntity } from '../entities/accessory.entity';

export class AccessoryDTO extends ProductDTO {
  @ApiProperty()
  @IsNumber()
  weight: number;

  static fromEntity(entity?: AccessoryEntity) {
    if (!entity) {
      return;
    }
    const it = new AccessoryDTO();
    it.id = entity.id;
    it.created = entity.created.valueOf();
    it.updated = entity.updated.valueOf();
    it.name = entity.name;
    it.price = entity.price;
    it.description = entity.description;
    it.image_url = entity.image_url;
    it.quantity = entity.quantity;
    it.category = entity.category;
    it.type = entity.type;
    it.archived = entity.archived;
    it.weight = entity.weight;
    return it;
  }

  static fromEntities(entities?: AccessoryEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
