import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import * as passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
      async (req, payload, next) => await this.verify(req, payload, next),
    );
    passport.use(this);
  }

  public async verify(req, payload: UserSessionDto, done) {
    console.log(payload);
    const user = await this.securityService.getUserById(payload.id);

    if (!user) {
      return done({ message: 'user doesnt exist' }, false);
    }

    done(null, payload);
  }
}
