import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { RefreshTokenRepo } from '../repo/refresh-token.repo';

@Entity({
  tableName: 'refresh_tokens',
  customRepository: () => RefreshTokenRepo,
})
export class RefreshTokenEntity extends UUIDEntity {
  @Property({ name: 'token', length: 500 })
  token!: string;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
