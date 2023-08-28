import { Check, Entity, ManyToOne, Property } from '@mikro-orm/core';

import { ProductEntity } from 'app/products/entities/product.entity';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { ReviewRepo } from '../repo/review.repo';

@Entity({
  tableName: 'reviews',
  customRepository: () => ReviewRepo,
})
export class ReviewEntity extends UUIDEntity {
  @Property({ length: 1000 })
  text: string;

  @Property()
  rating: number;

  @Property()
  edited: boolean;

  @Property()
  archived: boolean;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ProductEntity)
  product: ProductEntity;
}
