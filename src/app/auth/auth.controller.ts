import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { Tokens } from '../security/type/token.type';
import { AuthService } from './auth.service';
import { UserSignUpForm } from './dto/user-sign-up.form';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
