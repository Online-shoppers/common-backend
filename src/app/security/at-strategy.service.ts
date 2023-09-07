import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { I18nService } from 'nestjs-i18n';
import * as passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { ErrorCodes } from 'shared/enums/error-codes.enum';

import { UserSessionDto } from './dto/user-session.dto';
import { SecurityService } from './security.service';

@Injectable()
export class AtStrategyService extends Strategy {
  readonly name = 'jwt';

  constructor(
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService,
    private readonly securityService: SecurityService,
  ) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        passReqToCallback: true,
        secretOrKey: configService.get('app.AT_SECRET'),
      },
      async (req: Request, payload: UserSessionDto, next: VerifiedCallback) =>
        this.verify(req, payload, next),
    );
    passport.use(this);
  }

  public async verify(
    _: Request,
    payload: UserSessionDto,
    done: VerifiedCallback,
  ) {
    const user = await this.securityService.getUserById(payload.id);

    if (!user) {
      return done(
        new UnauthorizedException(
          this.i18nService.translate(ErrorCodes.NotAuthorizedRequest),
        ),
        false,
      );
    }

    done(null, payload);
  }
}
