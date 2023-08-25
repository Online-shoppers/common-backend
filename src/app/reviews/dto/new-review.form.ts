import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, validate } from 'class-validator';

export class NewReviewForm {
  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  rating: number;

  static from(form: NewReviewForm) {
    const it = new NewReviewForm();

    it.summary = form.summary;
    it.text = form.text;
    it.rating = form.rating;

    return it;
  }

  static async validate(form: NewReviewForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
