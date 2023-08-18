import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { difference, includes, isEmpty } from 'lodash';

import { UserSessionDto } from '../../security/dto/user-session.dto';
import { UserPermissions } from '../../user-roles/enums/user-permissions.enum';

export const RestrictRequest = (...scopes: UserPermissions[]) =>
  SetMetadata('user_permissions', scopes);

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('req', request.user);
    return request.user as UserSessionDto;
  },
);

@Injectable()
export class JwtPermissionsGuard
  extends AuthGuard('jwt-strategy')
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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  handleRequest(err: Error, user: UserSessionDto): UserSessionDto {
    if (err || !user) {
      this.logger.error('User is not authorized to perform request');
      throw (
        err || new UnauthorizedException({ message: 'UnauthorizedException' })
      );
    }

    if (isEmpty(this.permissions)) {
      return user;
    }

    if (includes(user.permissions, UserPermissions.All)) {
      return user;
    }

    if (difference(this.permissions, user.permissions).length) {
      this.logger.error('permission');
      throw new UnauthorizedException(
        new UnauthorizedException({ message: 'perm' }),
      );
    }

    return user;
  }
}
