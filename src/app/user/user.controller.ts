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
import { I18n, I18nContext, I18nLang } from 'nestjs-i18n';

import { CurrentUser } from 'app/security/decorators/current-user.decorator';
import { UserSessionDto } from 'app/security/dto/user-session.dto';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { UserDto } from './dtos/user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get user info' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserDto,
  })
  @Get(':userId')
  async getUserById(@Param('userId') userId: string, @I18nLang() lang: string) {
    const entity = await this.userService.getUserInfo(userId, lang);
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
    @I18nLang() lang: string,
  ) {
    if (!user) {
      throw new ForbiddenException(i18n.t(ErrorCodes.NotExists_User));
    }

    if (user.id !== id) {
      throw new ForbiddenException(i18n.t(ErrorCodes.Invalid_Permission));
    }

    return this.userService.archiveUser(id);
  }
}
