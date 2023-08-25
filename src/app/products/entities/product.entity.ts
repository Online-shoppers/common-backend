import {
  Collection,
  Entity,
  Enum,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { ReviewEntity } from 'app/reviews/entities/review.entity';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { ProductCategories } from '../enums/product-categories.enum';
import { ProductTypes } from '../enums/product-types.enum';
import { ProductRepo } from '../repo/product.repo';

@Entity({
  tableName: 'products',
  discriminatorColumn: 'category',
  discriminatorValue: 'product',
  customRepository: () => ProductRepo,
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description', length: 500 })
  description!: string;

  @Property({ name: 'image_url' })
  image_url!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum(() => ProductCategories)
  category!: ProductCategories;

  @Enum(() => ProductTypes)
  type!: ProductTypes;

  @Property({ name: 'archived', default: false })
  archived!: boolean;

  @OneToOne(() => CartProductEntity, {
    mappedBy: cartProduct => cartProduct.product,
  })
  cartProduct: CartProductEntity;

  @OneToMany(() => ReviewEntity, review => review.product)
  reviews = new Collection<ReviewEntity>(this);
}
