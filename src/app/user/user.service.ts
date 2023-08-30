import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserEvent } from '../../shared/notifications/user/user.event';
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
    private eventEmitter: EventEmitter2,
  ) {}

  async getUserByEmail(email: string) {
    return this.repo_user.findOne({ email: email });
  }

  async getUserById(userId: string) {
    return this.repo_user.findOne({ id: userId });
  }

  async getUsers() {
    return this.repo_user.getList();
  }
  async getUserInfo(userId: string) {
    return this.repo_user.getById(userId);
  }

  async archiveUser(userId: string) {
    const user = await this.repo_user.archiveUser(userId);
    this.eventEmitter.emit('delete.user', new UserEvent(user.email));
  }

  async addNewUser(dto: NewUserForm) {
    const e_role = await this.repo_user_roles.getDefaultRole(UserRoles.Client);
    const dto_role = UserRoleDto.fromEntity(e_role);
    const user = await this.repo_user.addUser(dto, dto_role);
    this.eventEmitter.emit('new.user', new UserEvent(user.email));
    return user;
  }
}
