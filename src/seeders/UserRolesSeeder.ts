import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { UserRoleEntity } from 'app/user-roles/entities/user-role.entity';
import { UserPermissions } from 'app/user-roles/enums/user-permissions.enum';
import { UserRoles } from 'app/user-roles/enums/user-roles.enum';

export class UserRolesSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const defaultRole = em.create(UserRoleEntity, {
      name: 'client',
      type: UserRoles.Client,
      permissions: [UserPermissions.GetUsers],
      isDefault: true,
    });

    await em.persistAndFlush(defaultRole);
  }
}
