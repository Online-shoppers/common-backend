import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { UserEntity } from 'app/user/entities/user.entity';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { CartRepo } from '../repo/cart.repo';

@Entity({ tableName: 'cart', customRepository: () => CartRepo })
export class CartEntity extends UUIDEntity {
  @OneToOne(() => UserEntity)
  user!: UserEntity;

  @Property({ persist: false })
  async total() {
    await this.products.init();

    return this.products
      .getItems()
      .reduce(
        (acc, cartProduct) =>
          acc + cartProduct.quantity * cartProduct.unitPrice(),
        0,
      );
  }

  @OneToMany({
    entity: () => CartProductEntity,
    mappedBy: product => product.cart,
  })
  products = new Collection<CartProductEntity>(this);
}
