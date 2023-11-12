import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlbumnQuery } from 'src/types/Albumn';
import { AlbumnService } from './albumn.service';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';
import { User } from 'src/decorators';
import { JWTPayload } from 'src/types';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guard/auth.guard';

const tag = 'albumn';

@ApiTags(tag)
@Controller(tag)
@UseGuards(AuthGuard)
export class AlbumnController {
  constructor(private readonly albumnService: AlbumnService) {}

  @Post()
  create(@Body() createAlbumnDto: CreateAlbumnDto, @User() user: JWTPayload) {
    return this.albumnService.create(createAlbumnDto, user.sub);
  }

  @Get()
  findAll(@Query() query: AlbumnQuery, @User() user: JWTPayload) {
    return this.albumnService.findAllAlbumns(query, user.sub);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumnService.findById(id, tag);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumnDto: UpdateAlbumnDto,
  ) {
    return this.albumnService.update(id, updateAlbumnDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @User() user: JWTPayload) {
    return this.albumnService.remove(id, user.sub);
  }
}
