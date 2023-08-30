import { Entity, Property } from '@mikro-orm/core';

import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { BeerRepo } from '../repo/beer.repo';

@Entity({
  discriminatorValue: ProductCategories.BEER,
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
