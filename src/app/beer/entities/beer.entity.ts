import { Entity, Property } from '@mikro-orm/core';

import { ProductEntity } from '../../../shared/entities/product.entity';
import { BeerRepo } from '../repo/beer.repo';

@Entity({
  discriminatorValue: 'beer',
  tableName: 'beer',
  customRepository: () => BeerRepo,
})
export class BeerEntity extends ProductEntity {
  @Property({ name: 'abv' })
  abv!: number; // Содержание алкоголя по объему

  @Property({ name: 'country' })
  country!: string;

  @Property({ name: 'ibu' })
  ibu!: number; // Горечь пива (International Bitterness Units)

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'availability' })
  availability!: boolean;

  @Property({ name: 'quantity' })
  quantity!: number;
}
