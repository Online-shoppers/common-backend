import { Entity, Enum, EnumType, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { BeerType } from '../enums/beerType.enum';
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

  @Enum({
    type: EnumType,
    name: 'type',
    array: true,
    items: () => BeerType,
  })
  type!: BeerType[];
}
