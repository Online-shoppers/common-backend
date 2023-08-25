import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, validate } from 'class-validator';

export class UpdateBeerForm {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsString()
  image_url: string;

  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  abv: number;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiProperty()
  @IsNumber()
  volume: number;

  @ApiProperty()
  @IsNumber()
  ibu: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: UpdateBeerForm) {
    const it = new UpdateBeerForm();

    it.name = form.name;
    it.description = form.description;
    it.price = form.price;
    it.quantity = form.quantity;
    it.abv = form.abv;
    it.country = form.country;
    it.volume = form.volume;
    it.ibu = form.ibu;
    it.image_url = form.image_url;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: UpdateBeerForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
