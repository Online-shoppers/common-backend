import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, validate } from 'class-validator';

export class UpdateAccessoryForm {
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
  weight: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: UpdateAccessoryForm) {
    const it = new UpdateAccessoryForm();

    it.name = form.name;
    it.description = form.description;
    it.price = form.price;
    it.quantity = form.quantity;
    it.weight = form.weight;
    it.image_url = form.image_url;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: UpdateAccessoryForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
