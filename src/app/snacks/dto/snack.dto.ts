import { IsEnum, IsNumber } from 'class-validator';

import { ProductDTO } from '../../../shared/dtos/product.dto';
import { SnacksEntity } from '../entities/snack.entity';
import { SnackType } from '../enums/snackType.enum';

export class SnacksDTO extends ProductDTO {
  @IsNumber()
  wieght: number;

  @IsEnum(SnackType)
  type: SnackType;

  static fromEntity(entity?: SnacksEntity) {
    if (!entity) {
      return;
    }
    const it = new SnacksDTO();
    it.wieght = entity.wieght;
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
