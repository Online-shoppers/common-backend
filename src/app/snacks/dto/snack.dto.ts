import { IsArray, IsNumber } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { SnacksEntity } from '../entities/snack.entity';
import { SnackType } from '../enums/snackType.enum';

export class SnacksDTO extends ProductDTO {
  @IsNumber()
  weight: number;

  @IsArray({ context: SnackType })
  type: SnackType[];

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
    it.archived = entity.archived;
    it.weight = entity.weight;
    it.type = entity.type;
    return it;
  }

  static fromEntities(entities?: SnacksEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
