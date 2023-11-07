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
} from '@nestjs/common';
import { AlbumnQuery } from 'src/types/Albumn';
import { AlbumnService } from './albumn.service';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';

@Controller('albumn')
export class AlbumnController {
  constructor(private readonly albumnService: AlbumnService) {}

  @Post()
  create(@Body() createAlbumnDto: CreateAlbumnDto) {
    return this.albumnService.create(createAlbumnDto);
  }

  @Get()
  findAll(@Query() query: AlbumnQuery) {
    return this.albumnService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.albumnService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAlbumnDto: UpdateAlbumnDto,
  ) {
    return this.albumnService.update(id, updateAlbumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumnService.remove(+id);
  }
}
