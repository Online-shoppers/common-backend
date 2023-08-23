import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

import { UUIDDto } from '../../../shared/dtos/uuid.dto';
import { OrderEntity } from '../../order/entities/order.entity';

export class OrderProductDTO extends UUIDDto {
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNumber()
  price: number;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  orderId: string;
}
