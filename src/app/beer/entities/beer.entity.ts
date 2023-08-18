import { Entity, Enum, Property } from '@mikro-orm/core';

import { BeerType } from 'app/beer/enums/beerType.enum';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { BeerRepo } from '../repo/beer.repo';

@Entity({
  discriminatorValue: 'beer',
  customRepository: () => BeerRepo,
})
export class BeerEntity extends ProductEntity {
  @Property({ name: 'abv' })
  abv!: number; // Содержание алкоголя по объему

  @Property({ name: 'country' })
  country!: string;

  @Property({ name: 'volume' })
  volume!: number;

  @Property({ name: 'ibu' })
  ibu!: number; // Горечь пива (International Bitterness Units)

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum({ name: 'type', array: false, items: () => BeerType })
  type!: BeerType;
}
