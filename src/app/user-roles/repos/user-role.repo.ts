import { EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { NewUserRoleForm } from '../dto/new-user-role.form';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UserRoles } from '../enums/user-roles.enum';

@Injectable()
export class UserRolesRepo extends EntityRepository<UserRoleEntity> {
  async getAll() {
    return await this.findAll();
  }

  async getById(id: string) {
    return await this.findOne({ id });
  }

  public async addOne(dto: NewUserRoleForm) {
    const role_e = this.create(dto);
    await this.persistAndFlush(role_e);
    return role_e;
  }

  public async getDefaultRole(type: UserRoles) {
    return this.findOne(
      { type, isDefault: true },
      { orderBy: { created: 'desc' } },
    );
  }
}
