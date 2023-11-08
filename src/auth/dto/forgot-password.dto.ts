import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SetNewPasswordDto {
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
