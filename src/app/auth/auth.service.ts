import { Injectable } from '@nestjs/common';

import { RefreshTokenRepo } from '../refresh-token/repo/refresh-token.repo';
import { SecurityService } from '../security/security.service';
import { Tokens } from '../security/type/token.type';
import { UserRoleDto } from '../user-roles/dto/user-role.dto';
import { UserRoles } from '../user-roles/enums/user-roles.enum';
import { UserRolesRepo } from '../user-roles/repos/user-role.repo';
import { UserRepo } from '../user/repos/user.repo';
import { UserService } from '../user/user.service';
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
    //method generates 2 tokens (refresh, access)
  }
}
