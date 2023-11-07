import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  password: string;

  @IsOptional()
  repeatedPassword: string;
}
