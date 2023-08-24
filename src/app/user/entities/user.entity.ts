import {
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';

import { CartEntity } from 'app/cart/entities/cart.entity';
import { OrderEntity } from 'app/order/entities/order.entity';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { RefreshTokenEntity } from '../../refresh-token/entity/refresh-token.entity';
import { UserRoleEntity } from '../../user-roles/entities/user-role.entity';
import { UserRepo } from '../repos/user.repo';

@Entity({ tableName: 'user', customRepository: () => UserRepo })
export class UserEntity extends UUIDEntity {
  @Property({ name: 'email', unique: true })
  email!: string;

  @Property({ name: 'first_name' })
  firstName!: string;

  @Property({ name: 'last_name' })
  lastName!: string;

  @Property({ name: 'password' })
  password!: string;

  @Property({ name: 'archived', default: false })
  archived: boolean;

  @ManyToOne(() => UserRoleEntity)
  role?: UserRoleEntity;

  @OneToMany(() => RefreshTokenEntity, e => e.user)
  refreshTokens?: RefreshTokenEntity[];

  @OneToOne({ entity: () => CartEntity, mappedBy: cart => cart.user })
  cart!: CartEntity;

  @OneToMany({ entity: () => OrderEntity, mappedBy: order => order.buyer })
  orders!: OrderEntity[];
}
