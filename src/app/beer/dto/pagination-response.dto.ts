import { ApiProperty } from '@nestjs/swagger';

import { BeerDTO } from './beer.dto';

class Info {
  @ApiProperty()
  total: number;
}

export class BeerPaginationResponse {
  @ApiProperty({ type: Info })
  info: Info;

  @ApiProperty({ type: BeerDTO, isArray: true })
  items: BeerDTO[];
}
