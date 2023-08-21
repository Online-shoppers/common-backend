import { IsJWT, isJWT, isString } from 'class-validator';

import { UserEntity } from '../../user/entities/user.entity';

export class TokensDto {
  @IsJWT()
  access_token: string;
  @IsJWT()
  refresh_token: string;
}
