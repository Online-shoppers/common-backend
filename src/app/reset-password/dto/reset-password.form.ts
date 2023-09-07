import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

export class ResetPasswordForm {
  @ApiProperty()
  @IsEmail(undefined, {
    message: i18nValidationMessage(ErrorCodes.FieldShouldBeEmail.toString()),
  })
  email: string;

  static from(form: ResetPasswordForm) {
    const it = new ResetPasswordForm();

    it.email = form.email;

    return it;
  }
}
