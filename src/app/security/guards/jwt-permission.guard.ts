import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { difference, includes, isEmpty } from 'lodash';

import { UserPermissions } from '../../user-roles/enums/user-permissions.enum';
import { UserSessionDto } from '../dto/user-session.dto';

export const RestrictRequest = (...scopes: UserPermissions[]) =>
  SetMetadata('user_permissions', [UserPermissions.All, ...scopes]);

@Injectable()
export class JwtPermissionsGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  protected readonly logger = new Logger('User Permissions Guard');

  protected permissions: UserPermissions[];

  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    this.permissions =
      this.reflector.get<UserPermissions[]>(
        'user_permissions',
        context.getHandler(),
      ) || [];
    return super.canActivate(context);
  }

  handleRequest<TUser = UserSessionDto>(
    err: Error,
    user: UserSessionDto,
    // info: any,
    // context: ExecutionContext,
    // status?: any,
  ): TUser {
    if (err || !user) {
      this.logger.error('User is not authorized to perform request');
      throw (
        err || new UnauthorizedException({ message: 'UnauthorizedException' })
      );
    }

    if (isEmpty(this.permissions)) {
      return user as TUser;
    }

    if (includes(user.permissions, UserPermissions.All)) {
      return user as TUser;
    }
    if (difference(this.permissions, user.permissions).length) {
      this.logger.error('permission');
      throw new UnauthorizedException(
        new UnauthorizedException({ message: 'perm' }),
      );
    }

    return user as TUser;
  }
}
