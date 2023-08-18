import { Entity, Property } from '@mikro-orm/core';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { UserRepo } from '../repos/user.repo';

@Entity({ tableName: 'user', customRepository: () => UserRepo })
export class UserEntity extends UUIDEntity {
  @Property({ name: 'email' })
  email!: string;
  @Property({ name: 'first_name' })
  firstName!: string;
  @Property({ name: 'last_name' })
  lastName!: string;
  @Property({ name: 'password' })
  password!: string;
  @Property({ name: 'archived' })
  archived!: boolean;

  //TODO
  // Add relations
}
