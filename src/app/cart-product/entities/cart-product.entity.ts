import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';

import { CartEntity } from 'app/cart/entities/cart.entity';

import { ProductEntity } from 'shared/entities/product.entity';
import { UUIDEntity } from 'shared/entities/uuid.entity';
import { ProductCategory } from 'shared/enums/productCategory.enum';

import { CartProductRepo } from '../repo/cart-product.repo';

@Entity({ tableName: 'cart-product', customRepository: () => CartProductRepo })
export class CartProductEntity extends UUIDEntity {
  @Property()
  name!: string;

  @Property()
  description!: string;

  @Enum(() => ProductCategory)
  category!: ProductCategory;

  @Property()
  quantity!: number;

  @ManyToOne(() => CartEntity, { onDelete: 'cascade' })
  cart!: CartEntity;

  @OneToOne(() => ProductEntity)
  product!: ProductEntity;
}
