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
  abv!: number; // Alcohol content by volume

  @Property({ name: 'country' })
  country!: string;

  @Property({ name: 'volume' })
  volume!: number;

  @Property({ name: 'ibu' })
  ibu!: number; // International Bitterness Units

  @Enum({ name: 'type', array: false, items: () => BeerType })
  type!: BeerType;
}
