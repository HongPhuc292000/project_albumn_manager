import { IsNotEmpty, IsOptional, IsUUID, MaxLength } from 'class-validator';

export class CreatePhotoDto {
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @MaxLength(1000)
  link: string;

  @IsOptional()
  @IsUUID()
  albumnId: string;
}
