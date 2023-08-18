import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepo } from '../user/repos/user.repo';
import { UserSessionDto } from './dto/user-session.dto';
import { Tokens } from './type/token.type';

@Injectable()
export class SecurityService {
  constructor(
    private readonly repo_user: UserRepo,
    private readonly repo_refresh_token: RefreshTokenRepo,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
  hashData(data) {
    return bcrypt.hash(data, 10);
  }

  async generateTokens(entity: UserEntity): Promise<Tokens> {
    const permissions = await this.repo_user.getUserRoles(entity.id);
    const payload = UserSessionDto.fromEntity(entity, permissions);
    const user = await this.repo_user.findOne({ id: entity.id });

    const at = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('AT_SECRET'),
      expiresIn: '15m',
    });
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('RT_SECRET'),
      expiresIn: '7d',
    });

    const rToken = await this.repo_refresh_token.addRefreshToken(user, rt);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
