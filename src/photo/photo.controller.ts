import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PhotoService } from './photo.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { User } from 'src/decorators';
import { JWTPayload } from 'src/types';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto, @User() user: JWTPayload) {
    return this.photoService.create(createPhotoDto, user.sub);
  }

  @Get()
  findAll() {
    return this.photoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.photoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePhotoDto: UpdatePhotoDto,
  ) {
    return this.photoService.update(id, updatePhotoDto);
  }

  @Patch('like/:id')
  likePhoto(@Param('id', ParseUUIDPipe) id: string, @User() user: JWTPayload) {
    return this.photoService.likePhoto(id, user.sub);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.photoService.remove(id);
  }
}
