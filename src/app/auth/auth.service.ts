import { ForbiddenException, Injectable } from '@nestjs/common';

import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { SecurityService } from '../security/security.service';
import { Tokens } from '../security/type/token.type';
import { UserRolesRepo } from '../user-roles/repos/user-role.repo';
import { UserService } from '../user/user.service';
import { UserSignInForm } from './dto/user-sign-in.form';
import { UserSignUpForm } from './dto/user-sign-up.form';

@Injectable()
export class AuthService {
  constructor(
    private readonly securityService: SecurityService,
    private readonly repo_user_roles: UserRolesRepo,
    private readonly repo_refresh_token: RefreshTokenRepo,
    private readonly userService: UserService,
  ) {}
  async signUp(dto: UserSignUpForm): Promise<Tokens> {
    dto.password = await this.securityService.hashData(dto.password);

    const entity = await this.userService.addNewUser(dto);

    const tokens = await this.securityService.generateTokens(entity);

    return tokens;
  }

  async signIn(dto: UserSignInForm): Promise<Tokens> {
    const user = await this.userService.getUser(dto.email);

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
