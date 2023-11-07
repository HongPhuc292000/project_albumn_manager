import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.albumnService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumnService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAlbumnDto: UpdateAlbumnDto) {
    return this.albumnService.update(+id, updateAlbumnDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.albumnService.remove(+id);
  }
}
