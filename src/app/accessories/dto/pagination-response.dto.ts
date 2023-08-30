import { ApiProperty } from '@nestjs/swagger';

import { AccessoryDTO } from './accessory.dto';

class Info {
  @ApiProperty()
  total: number;
}

export class AccessoryPaginationResponse {
  @ApiProperty({ type: Info })
  info: Info;

  @ApiProperty({ type: AccessoryDTO, isArray: true })
  items: AccessoryDTO[];
}
