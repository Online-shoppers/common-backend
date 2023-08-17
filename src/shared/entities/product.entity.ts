import { Entity, Enum, Property } from '@mikro-orm/core';

import { ProductCategory } from '../enums/productCategory.enum';
import { ProductType } from '../enums/productType.enum';
import { UUIDEntity } from './uuid.entity';

@Entity({
  discriminatorColumn: 'discr',
  discriminatorValue: 'Product',
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'description' })
  description!: string;

  @Enum({ name: 'category', array: false, items: () => ProductCategory })
  category!: ProductCategory;

  @Enum({ name: 'type', array: false, items: () => ProductType })
  type!: ProductType;

  @Property({ name: 'weight' })
  weight!: number;

  @Property({ name: 'volume' })
  volume!: number;

  @Property({ name: 'archived', default: false })
  archived!: boolean;
}
