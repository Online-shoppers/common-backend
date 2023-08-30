import { ApiProperty } from '@nestjs/swagger';

import { ProductDTO } from './product.dto';

class Info {
  @ApiProperty()
  total: number;
}

export class ProductsPaginationResponse {
  @ApiProperty({ type: Info })
  info: Info;

  @ApiProperty({ type: ProductDTO, isArray: true })
  items: ProductDTO[];
}
