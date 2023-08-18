import {
  Entity,
  Enum,
  EnumType,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { UUIDEntity } from '../../../shared/entities/uuid.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { UserPermissions } from '../enums/user-permissions.enum';
import { UserRoles } from '../enums/user-roles.enum';
import { UserRolesRepo } from '../repos/user-role.repo';

@Entity({ tableName: 'user_roles', customRepository: () => UserRolesRepo })
export class UserRoleEntity extends UUIDEntity {
  @PrimaryKey({ name: 'type', type: 'text' })
  type!: UserRoles;

  @Property({ name: 'name' })
  name!: string;

  @Enum({
    type: EnumType,
    name: 'permissions',
    array: true,
    items: () => UserPermissions,
  })
  permissions!: UserPermissions[];

  @Property({ name: 'is_default', type: 'boolean' })
  isDefault!: boolean;

  @OneToMany(() => UserEntity, e => e.role)
  users?: UserEntity[];
}
