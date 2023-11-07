import { Injectable } from '@nestjs/common';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';

@Injectable()
export class AlbumnService {
  create(createAlbumnDto: CreateAlbumnDto) {
    return 'This action adds a new albumn';
  }

  findAll() {
    return `This action returns all albumn`;
  }

  findOne(id: number) {
    return `This action returns a #${id} albumn`;
  }

  update(id: number, updateAlbumnDto: UpdateAlbumnDto) {
    return `This action updates a #${id} albumn`;
  }

  remove(id: number) {
    return `This action removes a #${id} albumn`;
  }
}
