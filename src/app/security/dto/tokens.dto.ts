import { ApiProperty } from '@nestjs/swagger';
import { IsJWT } from 'class-validator';

export class TokensDto {
  @ApiProperty()
  @IsJWT()
  access_token: string;

  @ApiProperty()
  @IsJWT()
  refresh_token: string;
}
