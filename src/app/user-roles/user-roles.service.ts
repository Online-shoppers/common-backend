import { Injectable } from '@nestjs/common';

import { NewUserRoleForm } from './dto/new-user-role.form';
import { UserRoles } from './enums/user-roles.enum';
import { UserRolesRepo } from './repos/user-role.repo';

@Injectable()
export class UserRolesService {
  constructor(private readonly repo_user_roles: UserRolesRepo) {}

  async getRoleById(id: string) {
    return this.repo_user_roles.findOneOrFail({ id });
  }

  async getDefaultRole(type: UserRoles) {
    return this.repo_user_roles.findOne(
      { type, isDefault: true },
      { orderBy: { created: 'desc' } },
    );
  }

  async addRole(dto: NewUserRoleForm) {
    const em = this.repo_user_roles.getEntityManager();
    const role_e = this.repo_user_roles.create(dto);

    await em.persistAndFlush(role_e);

    return role_e;
  }
}
