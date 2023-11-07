import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateAlbumnDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsOptional()
  @MaxLength(1000)
  description?: string;
}
