import { Entity, Property } from '@mikro-orm/core';

import { ProductCategory } from 'shared/enums/productCategory.enum';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { AccessoryRepo } from '../repo/accessories.repo';

@Entity({
  discriminatorValue: ProductCategory.ACCESSORIES,
  customRepository: () => AccessoryRepo,
})
export class AccessoryEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;
}
