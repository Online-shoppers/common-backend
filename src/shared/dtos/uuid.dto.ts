import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export abstract class UUIDDto {
  @ApiProperty({
    description: 'Entry id',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'Date created',
  })
  @IsNumber()
  created!: number;

  @ApiProperty({
    description: 'Date updated',
  })
  @IsNumber()
  updated!: number;
}
