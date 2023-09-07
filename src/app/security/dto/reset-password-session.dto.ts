import { IsEmail, validate } from 'class-validator';

export class ResetPasswordSessionDto {
  @IsEmail()
  email: string;

  public static from(dto: ResetPasswordSessionDto): ResetPasswordSessionDto {
    return {
      email: dto.email,
    };
  }

  public static async validate(dto: ResetPasswordSessionDto) {
    const errors = await validate(dto);
    if (errors?.length) {
      return errors;
    }

    return null;
  }
}
