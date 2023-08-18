import { Entity, OneToMany, OneToOne } from '@mikro-orm/core';

import { CartProductEntity } from 'app/cart-product/entities/cart-product.entity';
import { UserEntity } from 'app/user/entities/user.entity';

import { UUIDEntity } from 'shared/entities/uuid.entity';

import { CartRepo } from '../repo/cart.repo';

@Entity({ tableName: 'cart', customRepository: () => CartRepo })
export class CartEntity extends UUIDEntity {
  @OneToOne(() => UserEntity)
  user!: UserEntity;

  @OneToMany({
    entity: () => CartProductEntity,
    mappedBy: product => product.cart,
  })
  products: CartProductEntity[];
}
