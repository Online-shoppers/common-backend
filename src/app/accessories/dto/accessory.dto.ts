import { IsArray, IsNumber } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { AccessoryEntity } from '../entities/accessory.entity';
import { AccessoryType } from '../enums/accessoryType.enum';

export class AccessoryDTO extends ProductDTO {
  @IsNumber()
  weight: number;

  @IsArray({ context: AccessoryType })
  type: AccessoryType[];

  static fromEntity(entity?: AccessoryEntity) {
    if (!entity) {
      return;
    }
    const it = new AccessoryDTO();
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
