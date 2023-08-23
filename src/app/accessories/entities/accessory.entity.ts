import { Entity, Enum, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { AccessoryType } from '../enums/accessoryType.enum';
import { AccessoryRepo } from '../repo/accessories.repo';

@Entity({
  discriminatorValue: 'accessory',
  customRepository: () => AccessoryRepo,
})
export class AccessoryEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;

  type!: AccessoryType;
}
