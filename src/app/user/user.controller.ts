import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtPermissionsGuard } from 'app/security/guards/jwt-permission.guard';

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
  @UseGuards(JwtPermissionsGuard)
  // @RestrictRequest(UserPermissions.GetUsers)
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
  @ApiOperation({ summary: 'Makes user archived' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.archiveUser(id);
  }
}
