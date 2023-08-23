import { Entity, Enum, EnumType, OneToOne, Property } from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';

import { ProductCategory } from '../enums/productCategory.enum';
import { UUIDEntity } from './uuid.entity';

@Entity({
  tableName: 'products',
  discriminatorColumn: 'descr',
  discriminatorValue: 'product',
})
export class ProductEntity extends UUIDEntity {
  @Property({ name: 'name' })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({ name: 'description' })
  description!: string;

  @Property({ name: 'image_url' })
  image_url!: string;

  @Property({ name: 'quantity' })
  quantity!: number;

  @Enum(() => ProductCategory)
  category!: ProductCategory;

  @Property()
  type!: string;

  @Property({ name: 'archived', default: false })
  archived!: boolean;

  @OneToOne(() => CartProductEntity, {
    mappedBy: cartProduct => cartProduct.product,
  })
  cartProduct: CartProductEntity;
}
