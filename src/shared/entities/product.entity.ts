import { Entity, Enum, EnumType, Property } from '@mikro-orm/core';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDEntity } from './uuid.entity';

@Entity({
  tableName: 'products',
  discriminatorColumn: 'descr',
  discriminatorValue: 'product',
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'image_url' })
  image_url!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum(() => ProductCategory)
  category!: ProductCategory;

  @Property({ name: 'archived', default: false })
  archived!: boolean;
}
