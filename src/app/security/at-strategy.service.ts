import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';
import * as passport from 'passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { UserSessionDto } from './dto/user-session.dto';
import { SecurityService } from './security.service';

@Injectable()
export class AtStrategyService extends Strategy {
  readonly name = 'jwt';

  constructor(
    private readonly configService: ConfigService,
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
        new HttpException('User does not exists', HttpStatusCode.Unauthorized),
        false,
      );
    }

    done(null, payload);
  }
}
