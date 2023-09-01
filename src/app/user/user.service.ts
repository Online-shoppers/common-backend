import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { I18nService } from 'nestjs-i18n';

import { UserRolesService } from 'app/user-roles/user-roles.service';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { UserEvent } from '../../shared/notifications/user/user.event';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { NewUserForm } from './dtos/new-user.form';
import { UserDto } from './dtos/user.dto';
import { UserRepo } from './repos/user.repo';

@Injectable()
export class UserService {
  constructor(
    private readonly repo_user: UserRepo,
    private readonly userRolesService: UserRolesService,
    private readonly i18nService: I18nService,
    private eventEmitter: EventEmitter2,
  ) {}

  async getUserByEmail(email: string) {
    return this.repo_user.findOneOrFail({ email });
  }

  async getUserById(userId: string) {
    return this.repo_user.findOneOrFail({ id: userId });
  }

  async getUserInfo(userId: string) {
    try {
      const user = await this.getUserById(userId);
      return user;
    } catch (err) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.NotExists_User),
      );
    }
  }

  async getUserPermissions(userId: string) {
    const user = await this.repo_user.findOne({ id: userId });

    const roleId = user.role.id;

    const userRole = await this.userRolesService.getRoleById(roleId);
    return userRole.permissions;
  }

  async archiveUser(userId: string) {
    const em = this.repo_user.getEntityManager();

    const user = await this.repo_user.findOne({ id: userId });
    user.archived = true;

    await em.persistAndFlush(user);

    this.eventEmitter.emit('delete.user', new UserEvent(user.email));

    return UserDto.fromEntity(user);
  }

  async addNewUser(dto: NewUserForm) {
    const em = this.repo_user.getEntityManager();

    const defaultRole = await this.userRolesService.getDefaultRole(
      UserRoles.Client,
    );

    const newUser = this.repo_user.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      role: { id: defaultRole.id, type: defaultRole.type },
      cart: { products: [] },
    });

    await em.persistAndFlush(newUser);

    return newUser;
  }
}
