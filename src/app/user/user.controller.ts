import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtPermissionsGuard,
  RestrictRequest,
} from '../security/guards/jwt-permission.guard';
import { UserPermissions } from '../user-roles/enums/user-permissions.enum';
import { NewUserForm } from './dtos/new-user.form';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users list' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
    isArray: true,
  })
  @ApiBearerAuth()
  @UseGuards(JwtPermissionsGuard)
  @RestrictRequest(UserPermissions.GetUsers)
  @Get()
  async getUsers() {
    const entities = await this.userService.getUsers();
    return UserDto.fromEntities(entities);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    const entity = await this.userService.getUserInfo(userId);
    return UserDto.fromEntity(entity);
  }
  @ApiOperation({ summary: 'Make user archived' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.archiveUser(id);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @ApiBody({ type: UserDto, isArray: true })
  @Post()
  async addUsers(@Body() body: NewUserForm[]) {
    const [form] = body;
    const dto = NewUserForm.from(form);
    const errors = await NewUserForm.validate(dto);
    if (errors) {
      throw new BadRequestException({
        message: 'errors.invalid-form.user-new',
        errors,
      });
    }
    const entity = await this.userService.addNewUser(dto);
    return UserDto.fromEntity(entity);
  }
}
