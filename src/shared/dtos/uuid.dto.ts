import { ApiProperty } from '@nestjs/swagger';

export abstract class UUIDDto {
  @ApiProperty({
    description: 'Entry id',
  })
  id!: string;

  @ApiProperty({
    description: 'Date created',
  })
  created!: number;

  @ApiProperty({
    description: 'Date updated',
  })
  updated!: number;
}
