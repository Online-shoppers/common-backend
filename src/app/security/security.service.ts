import { Injectable, NotAcceptableException } from '@nestjs/common';
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
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  public async getUserById(userId: string) {
    return this.repo_user.getById(userId);
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  comparePassword(inputPassword: string, hashedPassword: string) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  async generateTokens(entity: UserEntity): Promise<Tokens> {
    const permissions = await this.repo_user.getUserRoles(entity.id);
    const payload = UserSessionDto.fromEntity(entity, permissions);
    const user = await this.repo_user.findOne({ id: entity.id });

    const at = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('app.AT_SECRET'),
      expiresIn: this.config.get<number>('app.AT_SECONDS_EXP'),
    });
    const rt = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('app.RT_SECRET'),
      expiresIn: this.config.get<number>('app.RT_SECONDS_EXP'),
    });
    await this.repo_refresh_token.addRefreshToken(user, rt);

    return {
      access_token: at,
      refresh_token: rt,
      accessTimeExp: this.config.get<number>('AT_TIME_EXP'),
      refreshTimeExp: this.config.get<number>('RT_TIME_EXP'),
    };
  }

  async refreshTokens(accessToken: string, refreshToken: string) {
    const validTokens =
      this.validateAccessToken(accessToken) &&
      (await this.validateRefreshToken(refreshToken));
    if (!validTokens) {
      throw new NotAcceptableException('Invalid tokens');
    }

    const accessPayload = this.jwtService.decode(accessToken) as UserSessionDto;

    const user = await this.repo_user.findOne({ id: accessPayload.id });
    return this.generateTokens(user);
  }

  async validateRefreshToken(token: string) {
    const secret = this.config.get<string>('RT_SECRET');
    try {
      const tokenEntity = await this.repo_refresh_token.findOne({ token });
      if (!tokenEntity) {
        return false;
      }
      await this.repo_refresh_token.nativeDelete({ token });
      const payload = this.jwtService.verify(token, { secret });
      return new Date().getTime() < payload.exp * 1000;
    } catch (err) {
      return false;
    }
  }

  validateAccessToken(token: string) {
    const secret = this.config.get<string>('AT_SECRET');
    try {
      const payload = this.jwtService.verify(token, { secret });
      return new Date().getTime() < payload.exp * 1000;
    } catch (err) {
      return false;
    }
  }
}
