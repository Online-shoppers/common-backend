import { Injectable } from '@nestjs/common';

import { UserRoleDto } from '../user-roles/dto/user-role.dto';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserRolesRepo } from '../user-roles/repos/user-role.repo';
import { NewUserForm } from './dtos/new-user.form';
import { UserRepo } from './repos/user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly repo_user: UserRepo,
    private readonly repo_user_roles: UserRolesRepo,
  ) {}

  async getUser(email: string) {
    return await this.repo_user.findOne({ email: email });
  }
  async getUsers() {
    return await this.repo_user.getList();
  }
  async getUserInfo(userId: string) {
    return await this.repo_user.getById(userId);
  }

  async archiveUser(userId: string) {
    return await this.repo_user.archiveUser(userId);
  }

  async addNewUser(dto: NewUserForm) {
    const e_role = await this.repo_user_roles.getDefaultRole(UserRoles.Client);
    const dto_role = UserRoleDto.fromEntity(e_role);
    return await this.repo_user.addUser(dto, dto_role);
  }
}
