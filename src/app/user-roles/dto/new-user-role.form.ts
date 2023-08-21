import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
  validate,
} from 'class-validator';

import { UserPermissions } from '../enums/user-permissions.enum';
import { UserRoles } from '../enums/user-roles.enum';

export class NewUserRoleForm {
  @IsEnum(UserRoles)
  type!: UserRoles;

  @IsString()
  name!: string;

  @IsArray({ context: UserPermissions })
  permissions!: UserPermissions[];

  @IsBoolean()
  isDefault!: boolean;

  public static from(form: NewUserRoleForm) {
    const it = new NewUserRoleForm();
    it.type = form.type;
    it.name = form.name;
    it.permissions = form.permissions;
    it.isDefault = form.isDefault;
    return it;
  }

  public static async validate(form: NewUserRoleForm) {
    const errors = await validate(form);
    return errors?.length ? errors : void 0;
  }
}
