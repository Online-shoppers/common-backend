import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { UserRoleDto } from '../../user-roles/dto/user-role.dto';
import { UserRolesRepo } from '../../user-roles/repos/user-role.repo';
import { NewUserForm } from '../dtos/new-user.form';
import { UserDto } from '../dtos/user.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepo extends EntityRepository<UserEntity> {
  constructor(
    private readonly manager: EntityManager,
    private readonly userRolesRepo: UserRolesRepo,
  ) {
    super(manager, UserEntity);
  }
  async getList() {
    return this.findAll();
  }
  async getById(id: string) {
    return this.findOne({ id });
  }
  async archiveUser(userId: string) {
    const user = await this.findOne({ id: userId });
    user.archived = true;
    await this.persistAndFlush(user);
    return UserDto.fromEntity(user);
  }

  async addUser(dto: NewUserForm, dto_role: UserRoleDto) {
    const newUser = this.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      roleId: dto_role.id,
      roleType: dto_role.type,
      cart: { products: [] },
    });

    await this.getEntityManager().persistAndFlush(newUser);
    return newUser;
  }

  async getUserRoles(userId: string) {
    const user = await this.findOne({ id: userId });

    const userRoles = await this.userRolesRepo.findOne({ id: user.roleId });
    return userRoles.permissions;
  }
}
