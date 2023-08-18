import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../user/dtos/user.dto';

export class RefreshTokenDTO {
  @ApiProperty()
  token: string;

  @ApiProperty()
  user: UserDto; // Предполагается, что есть DTO для UserEntity
}
