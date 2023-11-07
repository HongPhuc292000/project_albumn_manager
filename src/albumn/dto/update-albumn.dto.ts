import { PartialType } from '@nestjs/mapped-types';
import { CreateAlbumnDto } from './create-albumn.dto';

export class UpdateAlbumnDto extends PartialType(CreateAlbumnDto) {}
