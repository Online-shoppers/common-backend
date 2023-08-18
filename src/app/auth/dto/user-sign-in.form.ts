import { IsEmail, IsString, validate } from 'class-validator';

import { ErrorCodes } from '../../../shared/enums/error-codes.enum';

export class UserSignInForm {
  @IsEmail(undefined, { message: ErrorCodes.FieldShouldBeEmail })
  email!: string;

  @IsString({ message: ErrorCodes.FieldShouldBeString })
  password!: string;

  static from(dto: UserSignInForm) {
    const it = new UserSignInForm();
    it.email = dto.email;
    it.password = dto.password;
    return it;
  }

  static async validate(dto: UserSignInForm) {
    const errors = await validate(dto);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
