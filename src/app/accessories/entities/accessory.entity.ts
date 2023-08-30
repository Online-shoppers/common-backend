import { Entity, Property } from '@mikro-orm/core';

import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { AccessoryRepo } from '../repo/accessories.repo';

@Entity({
  discriminatorValue: ProductCategories.ACCESSORIES,
  customRepository: () => AccessoryRepo,
})
export class AccessoryEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;
}
