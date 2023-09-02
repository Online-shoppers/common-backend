import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

import { ErrorCodes } from '../../shared/enums/error-codes.enum';
import { SecurityService } from '../security/security.service';
import { Tokens } from '../security/type/token.type';
import { UserService } from '../user/user.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

@Injectable()
export class AuthService {
  constructor(
    private readonly securityService: SecurityService,
    private readonly userService: UserService,
    private readonly i18nService: I18nService,
  ) {}
  async signUp(dto: UserSignUpForm): Promise<Tokens> {
    const existing = await this.userService.getUserByEmail(dto.email);
    if (existing) {
      throw new BadRequestException(
        this.i18nService.translate(ErrorCodes.Exists_User, {
          lang: I18nContext.current().lang,
        }),
      );
    }

    dto.password = await this.securityService.hashPassword(dto.password);

    const entity = await this.userService.addNewUser(dto);

    const tokens = await this.securityService.generateTokens(entity);

    return tokens;
  }

  async signIn(dto: UserSignInForm): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user)
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.Invalid_Creds, {
          lang: I18nContext.current().lang,
        }),
      );

    const passwordMatches = await this.securityService.comparePassword(
      dto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new ForbiddenException(
        this.i18nService.translate(ErrorCodes.Invalid_Creds, {
          lang: I18nContext.current().lang,
        }),
      );

    return this.securityService.generateTokens(user);
  }
}
