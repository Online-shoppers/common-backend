import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, validate } from 'class-validator';

export class UpdateSnackForm {
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
  @IsBoolean()
  archived: boolean;

  @ApiProperty()
  @IsNumber()
  weight: number;

  static from(form: UpdateSnackForm) {
    const it = new UpdateSnackForm();

    it.name = form.name;
    it.description = form.description;
    it.price = form.price;
    it.quantity = form.quantity;
    it.weight = form.weight;
    it.image_url = form.image_url;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: UpdateSnackForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
