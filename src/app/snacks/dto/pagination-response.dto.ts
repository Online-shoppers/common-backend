import { ApiProperty } from '@nestjs/swagger';

import { SnacksDTO } from './snack.dto';

class Info {
  @ApiProperty()
  total: number;
}

export class SnacksPaginationResponse {
  @ApiProperty({ type: Info })
  info: Info;

  @ApiProperty({ type: SnacksDTO, isArray: true })
  items: SnacksDTO[];
}
