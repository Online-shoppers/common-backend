import { Entity, Enum, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { SnackType } from '../enums/snackType.enum';
import { SnackRepo } from '../repo/snack.repo';

@Entity({
  discriminatorValue: 'snacks',
  customRepository: () => SnackRepo,
})
export class SnacksEntity extends ProductEntity {
  @Property({ name: 'wieght' })
  wieght!: number;

  @Enum({ name: 'type', array: false, items: () => SnackType })
  type!: SnackType;
}
