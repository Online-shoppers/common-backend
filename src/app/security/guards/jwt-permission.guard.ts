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
import { I18nService } from 'nestjs-i18n';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';
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

  constructor(
    private readonly reflector: Reflector,
    private readonly i18nService: I18nService,
  ) {
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
      throw (
        err ||
        new UnauthorizedException(
          this.i18nService.translate(ErrorCodes.NotAuthorizedRequest),
        )
      );
    }

    if (
      user.permissions.some(userPermission =>
        this.permissions.includes(userPermission),
      )
    ) {
      return user as TUser;
    }

    throw new UnauthorizedException(
      this.i18nService.translate(ErrorCodes.Invalid_Permission),
    );
  }
}
