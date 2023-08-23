import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { SnacksEntity } from '../entities/snack.entity';

export class SnacksDTO extends ProductDTO {
  @ApiProperty()
  @IsNumber()
  weight: number;

  static fromEntity(entity?: SnacksEntity) {
    if (!entity) {
      return;
    }
    const it = new SnacksDTO();
    it.id = entity.id;
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

  static fromEntities(entities?: SnacksEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
