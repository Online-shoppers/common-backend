import { Entity, Enum, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { SnacksRepo } from '../repo/snack.repo';

@Entity({
  discriminatorValue: 'snacks',
  customRepository: () => SnacksRepo,
})
export class SnacksEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;
}
