import { IsEmail, IsInt, IsNotEmpty, Length, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
