import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

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
  ) {}
  async signUp(dto: UserSignUpForm): Promise<Tokens> {
    const existing = await this.userService.getUserByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('User already exists');
    }

    dto.password = await this.securityService.hashData(dto.password);

    const entity = await this.userService.addNewUser(dto);

    const tokens = await this.securityService.generateTokens(entity);

    return tokens;
  }

  async signIn(dto: UserSignInForm): Promise<Tokens> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) throw new ForbiddenException('User is not found');

    const passwordMatches = await this.securityService.comparePassword(
      dto.password,
      user.password,
    );
    if (!passwordMatches)
      throw new ForbiddenException('Password is not correct');

    return await this.securityService.generateTokens(user);
  }
}
