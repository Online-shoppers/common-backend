import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { I18n, I18nContext, I18nService } from 'nestjs-i18n';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { TokensDto } from '../security/dto/tokens.dto';
import { SecurityService } from '../security/security.service';
import { Tokens } from '../security/type/token.type';
import { AuthService } from './auth.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService,
    private readonly i18nService: I18nService,
  ) {}

  @ApiBody({ type: UserSignUpForm })
  @ApiResponse({ type: TokensDto })
  @Post('/sign-up')
  async signUp(
    @Body() body: UserSignUpForm,
    @I18n() i18n: I18nContext,
  ): Promise<Tokens> {
    const dto = UserSignUpForm.from(body);
    const errors = await UserSignUpForm.validate(dto);
    if (errors) {
      throw new BadRequestException({
        message: i18n.t(ErrorCodes.InvalidForm),
        errors,
      });
    }
    return this.authService.signUp(dto);
  }

  @ApiBody({ type: UserSignInForm })
  @ApiResponse({ type: TokensDto })
  @ApiOperation({ summary: 'Sign in for user' })
  @Post('/sign-in')
  async signIn(@Body() body: UserSignInForm): Promise<Tokens> {
    const dto = UserSignInForm.from(body);
    return this.authService.signIn(dto);
  }

  @ApiBody({ type: TokensDto })
  @ApiResponse({ type: TokensDto })
  @ApiOperation({ summary: 'Refresh tokens' })
  @Post('/refresh')
  async refreshTokens(@Body() body: TokensDto): Promise<Tokens> {
    return this.securityService.refreshTokens(
      body.access_token,
      body.refresh_token,
    );
  }
}
