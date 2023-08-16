import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { ProductSchema } from '../enums/productShema.enum';
import { ProductType } from '../enums/productTypy.enum';

@Entity()
export class ProductEntity {
  @PrimaryKey()
  id!: number;

  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'description' })
  description!: string;

  @Enum({ name: 'status', array: false, items: () => ProductSchema })
  schema!: ProductSchema;

  @Enum({ name: 'status', array: false, items: () => ProductType })
  type!: ProductType;

  @Property({ name: 'weight' })
  weight!: number;

  @Property({ name: 'volume' })
  volume!: number;

  @Property({ name: 'archived' })
  archived!: boolean;
}
