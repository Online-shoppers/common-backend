import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { NewUserForm } from './dtos/new-user.form';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: [UserDto],
    isArray: true,
  })
  @Get()
  async getUsers() {
    const entities = await this.userService.getUsers();
    return UserDto.fromEntities(entities);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
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
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.archiveUser(id);
  }

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
  })
  @Post()
  async addUsers(@Body() body: NewUserForm[]) {
    const [form] = body;
    console.log(form);
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
