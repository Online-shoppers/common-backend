import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';

import { NewPasswordForm } from './dto/new-password.form';
import { ResetPasswordForm } from './dto/reset-password.form';
import { ResetPasswordService } from './reset-password.service';

@ApiTags('Reset password')
@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  async getResetToken(
    @Body() resetForm: ResetPasswordForm,
    @I18nLang() lang: string,
  ) {
    return this.resetPasswordService.getResetToken(resetForm, lang);
  }

  @Post(':resetToken')
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() resetForm: NewPasswordForm,
    @I18nLang() lang: string,
  ) {
    return this.resetPasswordService.resetPassword(resetToken, resetForm, lang);
  }
}
