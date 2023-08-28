import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsString,
  Max,
  Min,
  validate,
} from 'class-validator';

export class EditReviewForm {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty()
  @IsBoolean()
  archived: boolean;

  static from(form: EditReviewForm) {
    const it = new EditReviewForm();

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
