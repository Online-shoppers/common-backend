import { Controller, Delete, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users list' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'HttpStatus:200:OK',
    type: UserDto,
    isArray: true,
  })
  @Get()
  async getUsers() {
    const entities = await this.userService.getUsers();
    return UserDto.fromEntities(entities);
  }

  @Get(':userId')
  async getUserById(@Param('userId') userId: string) {
    const entity = await this.userService.getUserInfo(userId);
    return UserDto.fromEntity(entity);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.archiveUser(id);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }
  //

  //
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }
  //
}
