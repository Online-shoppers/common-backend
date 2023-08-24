import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

import { UserPermissions } from '../../user-roles/enums/user-permissions.enum';
import { UserRoles } from '../../user-roles/enums/user-roles.enum';
import { UserEntity } from '../../user/entities/user.entity';

// ============ enums ===============

export class UserSessionDto {
  @IsUUID()
  id: string;

  @IsString()
  email: string;

  @IsUUID()
  role_id: string;

  @IsString()
  role_type: UserRoles;

  @IsArray({ context: UserPermissions })
  permissions: UserPermissions[];

  @IsNumber()
  exp?: number;
  public static from(dto: UserSessionDto): UserSessionDto {
    return {
      id: dto.id,
      role_id: dto.role_id,
      role_type: dto.role_type,
      email: dto.email,
      permissions: dto.permissions,
    };
  }

  public static fromEntity(
    entity: UserEntity,
    permissions: UserPermissions[],
  ): UserSessionDto {
    return {
      id: entity.id,
      email: entity.email,
      role_id: entity.role.id,
      role_type: entity.role.type,
      permissions,
    };
  }
}
