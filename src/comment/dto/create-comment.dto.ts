import { IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(1000)
  content: string;

  @IsNotEmpty()
  @IsUUID()
  photoId: string;
}
