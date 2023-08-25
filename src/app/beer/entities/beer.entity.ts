import { Entity, Property } from '@mikro-orm/core';

import { ProductCategory } from 'shared/enums/productCategory.enum';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { BeerRepo } from '../repo/beer.repo';

@Entity({
  discriminatorValue: ProductCategory.BEER,
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
}
