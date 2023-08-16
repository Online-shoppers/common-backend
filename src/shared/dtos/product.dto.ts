import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';

import { BeerSchema } from 'shared/enums/beerShema.enum';
import { BeerType } from 'shared/enums/beerType.enum';

export abstract class ProductDTO {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsEnum(BeerSchema)
  schema: BeerSchema;

  @IsEnum(BeerType)
  type: BeerType;

  @IsNumber()
  weight: number;

  @IsNumber()
  volume: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'false')
  archived: boolean;
}
