import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { BeerSchema } from 'shared/enums/beerShema.enum';
import { BeerType } from 'shared/enums/beerType.enum';

@Entity()
export abstract class ProductEntity {
  @PrimaryKey()
  id!: number;

  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'description' })
  description!: string;

  @Enum({ name: 'status', array: false, items: () => BeerSchema })
  schema!: BeerSchema;

  @Enum({ name: 'status', array: false, items: () => BeerType })
  type!: BeerType;

  @Property({ name: 'weight' })
  weight!: number;

  @Property({ name: 'volume' })
  volume!: number;

  @Property({ name: 'archived', default: false })
  archived!: boolean;
}
