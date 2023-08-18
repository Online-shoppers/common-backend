import { Entity, Enum, OneToOne, Property } from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDEntity } from './uuid.entity';

@Entity({
  discriminatorColumn: 'discr',
  discriminatorValue: 'Product',
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'description' })
  description!: string;

  @Enum({ name: 'category', array: false, items: () => ProductCategory })
  category!: ProductCategory;

  @Property({ name: 'archived', default: false })
  archived!: boolean;

  @OneToOne(() => CartProductEntity, {
    mappedBy: cartProduct => cartProduct.product,
  })
  cartProduct: CartProductEntity;
}
