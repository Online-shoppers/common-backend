import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  ValidateNested,
} from 'class-validator';

import { UUIDDto } from '../../../shared/dtos/uuid.dto';
import { UserDto } from '../../user/dtos/user.dto';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UserPermissions } from '../enums/user-permissions.enum';
import { UserRoles } from '../enums/user-roles.enum';

export class UserRoleDto extends UUIDDto {
  @IsEnum(UserRoles)
  type: UserRoles;

  @IsString()
  name: string;

  @IsArray({ context: UserPermissions })
  permissions: UserPermissions[];

  @IsBoolean()
  isDefault: boolean;

  @ValidateNested({ context: UserDto })
  users?: UserDto[];

  public static fromEntity(entity: UserRoleEntity) {
    const it = new UserRoleDto();
    it.id = entity.id;
    it.created = new Date(entity.created).valueOf();
    it.updated = new Date(entity.updated).valueOf();
    it.type = entity.type;
    it.name = entity.name;
    it.permissions = entity.permissions;
    it.isDefault = entity.isDefault;

    it.users = UserDto.fromEntities(entity.users);
    return it;
  }

  static fromEntities(entities?: UserRoleEntity[]) {
    if (!entities?.map) {
      return;
    }
    return entities.map(entity => this.fromEntity(entity));
  }
}
