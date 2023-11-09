import { IsEmail, IsInt, IsNotEmpty, Length } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example 111111
   */
  @IsNotEmpty()
  @IsInt()
  code: number;
}
