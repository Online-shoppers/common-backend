import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class CreateCartProductForm {
  @IsString()
  @ApiProperty()
  name?: string;

  @IsString()
  @ApiProperty()
  description?: string;

  @IsInt()
  @ApiProperty()
  quantity?: number;
}
