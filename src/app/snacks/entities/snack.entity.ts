import { Entity, Property } from '@mikro-orm/core';

import { ProductCategory } from 'shared/enums/productCategory.enum';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { SnacksRepo } from '../repo/snack.repo';

@Entity({
  discriminatorValue: ProductCategory.CATEGORY_SNACKS,
  customRepository: () => SnacksRepo,
})
export class SnacksEntity extends ProductEntity {
  @Property({ name: 'weight' })
  weight!: number;
}
