import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';
import { JwtPermissionsGuard } from 'app/security/guards/jwt-permission.guard';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
  ) {}

  @ApiOperation({ summary: 'Get all users list' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: UserSessionDto,
    @I18n() i18n: I18nContext,
  ) {
    if (!user) {
      throw new ForbiddenException(i18n.t(ErrorCodes.Invalid_Permission));
    }

    if (user.id !== id) {
      throw new ForbiddenException(i18n.t(ErrorCodes.Invalid_Permission));
    }

    return this.userService.archiveUser(id);
  }
}
