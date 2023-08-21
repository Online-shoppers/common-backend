import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AST } from 'eslint';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { TokensDto } from '../security/dto/tokens.dto';
import { SecurityService } from '../security/security.service';
import { Tokens } from '../security/type/token.type';
import { AuthService } from './auth.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

import Token = AST.Token;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly securityService: SecurityService,
  ) {}

  @ApiOperation({ summary: 'Sign up for user' })
  @Post('/sign-up')
  async signUp(@Body() body: UserSignUpForm): Promise<Tokens> {
    const dto = UserSignUpForm.from(body);
    const errors = await UserSignUpForm.validate(dto);
    if (errors) {
      throw new BadRequestException({
        message: ErrorCodes.InvalidForm,
        errors,
      });
    }
    return await this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Sign in for user' })
  @Post('/sign-in')
  async signIn(@Body() body: UserSignInForm): Promise<Tokens> {
    const dto = UserSignInForm.from(body);
    return await this.authService.signIn(dto);
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @Post('/refresh')
  async refreshTokens(@Body() body: TokensDto): Promise<Tokens> {
    return await this.securityService.refreshTokens(
      body.access_token,
      body.refresh_token,
    );
  }
}