import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, validate } from 'class-validator';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class UserSignUpForm {
  @ApiProperty()
  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  password!: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  passwordConfirm!: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  firstName!: string;

  @ApiProperty()
  @IsString({ message: ErrorCodes.FieldShouldBeString })
  lastName!: string;

  static from(form: UserSignUpForm) {
    const it = new UserSignUpForm();
    it.email = form.email;
    it.password = form.password;
    it.passwordConfirm = form.passwordConfirm;
    it.firstName = form.firstName;
    it.lastName = form.lastName;
    return it;
  }

  static async validate(form: UserSignUpForm) {
    const errors = await validate(form);
    if (errors?.length) {
      return errors;
    }
    return null;
  }
}
