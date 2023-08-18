import { IsEmail, IsString, validate } from 'class-validator';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class UserSignUpForm {
  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  password!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  passwordConfirm!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  firstName!: string;
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
