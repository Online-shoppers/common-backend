import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString, validate } from 'class-validator';

export class EditReviewForm {
  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  rating: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: EditReviewForm) {
    const it = new EditReviewForm();

    it.summary = form.summary;
    it.text = form.text;
    it.rating = form.rating;
    it.archived = form.archived;

    return it;
  }

  static async validate(form: EditReviewForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
