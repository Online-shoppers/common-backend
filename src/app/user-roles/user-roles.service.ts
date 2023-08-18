import { Injectable } from '@nestjs/common';

import { NewUserRoleForm } from './dto/new-user-role.form';
import { UserRolesRepo } from './repos/user-role.repo';

@Injectable()
export class UserRolesService {
  constructor(private readonly repo_user_roles: UserRolesRepo) {}
  async addRole(dto: NewUserRoleForm) {
    return this.repo_user_roles.addOne(dto);
  }
}
