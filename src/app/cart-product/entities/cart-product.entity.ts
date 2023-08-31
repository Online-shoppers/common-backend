import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { CartEntity } from 'app/cart/entities/cart.entity';
import { ProductEntity } from 'app/products/entities/product.entity';
import { ProductCategories } from 'app/products/enums/product-categories.enum';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { CartProductRepo } from '../repo/cart-product.repo';

@Entity({ tableName: 'cart-product', customRepository: () => CartProductRepo })
export class CartProductEntity extends UUIDEntity {
  @Property()
  name!: string;

  @Property()
  description!: string;

  @Enum(() => ProductCategories)
  category!: ProductCategories;

  @Property()
  quantity!: number;

  @Property({ persist: false })
  unitPrice() {
    return this.product.price;
  }

  @ManyToOne(() => CartEntity, { onDelete: 'cascade' })
  cart!: CartEntity;

  @ManyToOne(() => ProductEntity)
  product!: ProductEntity;
}
