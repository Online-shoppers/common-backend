import { Entity, Enum, EnumType, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { SnackType } from '../enums/snackType.enum';
import { SnacksRepo } from '../repo/snack.repo';

@Entity({
  discriminatorValue: 'snacks',
  customRepository: () => SnacksRepo,
})
export class SnacksEntity extends ProductEntity {
  @Property({ name: 'wieght' })
  weight!: number;

  @Enum({
    type: EnumType,
    name: 'type',
    array: true,
    items: () => SnackType,
  })
  type!: SnackType[];
}
