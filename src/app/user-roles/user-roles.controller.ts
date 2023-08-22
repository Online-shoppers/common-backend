import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { NewUserRoleForm } from './dto/new-user-role.form';
import { UserRoleDto } from './dto/user-role.dto';
import { UserRolesService } from './user-roles.service';

@ApiTags('User roles')
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @ApiBody({ type: UserRoleDto, isArray: true })
  @Post()
  public async addRoles(@Body() body: UserRoleDto[]) {
    const [form] = body;
    if (!form) {
      throw new BadRequestException({});
    }

    const dto = NewUserRoleForm.from(form);
    const errors = await NewUserRoleForm.validate(dto);
    if (errors) {
      throw new BadRequestException({ errors });
    }

    const entity = await this.userRolesService.addRole(dto);

    return UserRoleDto.fromEntity(entity);
  }
}
