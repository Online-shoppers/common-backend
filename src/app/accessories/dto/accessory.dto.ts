import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { AccessoryEntity } from '../entities/accessory.entity';
import { AccessoryType } from '../enums/accessoryType.enum';

export class AccessoryDTO extends ProductDTO {
  @ApiProperty()
  @IsNumber()
  weight: number;

  @ApiProperty()
  @IsEnum(AccessoryType)
  type: AccessoryType;

  static fromEntity(entity?: AccessoryEntity) {
    if (!entity) {
      return;
    }
    const it = new AccessoryDTO();
    it.id = entity.id;
    it.name = entity.name;
    it.price = entity.price;
    it.description = entity.description;
    it.image_url = entity.image_url;
    it.quantity = entity.quantity;
    it.category = entity.category;
    it.archived = entity.archived;
    it.weight = entity.weight;
    it.type = entity.type;
    return it;
  }

  static fromEntities(entities?: AccessoryEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
