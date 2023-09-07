import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';

import { ResetPasswordSessionDto } from 'app/security/dto/reset-password-session.dto';
import { SecurityService } from 'app/security/security.service';
import { UserService } from 'app/user/user.service';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { NewPasswordForm } from './dto/new-password.form';
import { ResetPasswordForm } from './dto/reset-password.form';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly usersService: UserService,
    private readonly securityService: SecurityService,
    private readonly jwtService: JwtService,
    private readonly i18nService: I18nService,
  ) {}

  async getResetToken(dto: ResetPasswordForm, lang: string): Promise<string> {
    const user = await this.usersService.getUserByEmail(dto.email);

    if (!user) {
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.NotExists_User, {
          lang,
        }),
      );
    }

    return this.securityService.generateResetToken(dto);
  }

  async resetPassword(token: string, dto: NewPasswordForm, lang: string) {
    const valid = await this.securityService.validateResetToken(token);

    if (!valid) {
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.InvalidTokens, {
          lang,
        }),
      );
    }

    const resetPayload = this.jwtService.decode(
      token,
    ) as ResetPasswordSessionDto;
    const errors = ResetPasswordSessionDto.validate(resetPayload);

    if (!errors) {
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.InvalidTokens, {
          lang,
        }),
      );
    }

    const hashed = await this.securityService.hashPassword(dto.password);

    await this.usersService.updateUserPasswordByEmail(
      resetPayload.email,
      hashed,
    );
  }
}
