import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewPasswordForm {
  @ApiProperty()
  @IsString()
  password: string;

  static from(form: NewPasswordForm) {
    const it = new NewPasswordForm();

    it.password = form.password;

    return it;
  }
}
