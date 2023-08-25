import { Entity, Property } from '@mikro-orm/core';

import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { SnacksRepo } from '../repo/snack.repo';

@Entity({
  discriminatorValue: ProductCategories.SNACKS,
  customRepository: () => SnacksRepo,
})
export class SnacksEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;
}
