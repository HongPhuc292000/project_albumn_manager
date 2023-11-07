import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListResponseData, ResponseData } from 'src/types';
import { AlbumnQuery } from 'src/types/Albumn';
import { Like, Repository } from 'typeorm';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';
import { Albumn } from './entities/albumn.entity';

@Injectable()
export class AlbumnService {
  constructor(
    @InjectRepository(Albumn) private albumnRepository: Repository<Albumn>,
  ) {}

  @HttpCode(201)
  async create(createAlbumnDto: CreateAlbumnDto) {
    const albumn = this.albumnRepository.create(createAlbumnDto);
    const result = await this.albumnRepository.save(albumn);
    return new ResponseData(result.id, HttpStatus.CREATED, 'ok');
  }

  async findAll(query: AlbumnQuery) {
    const { page = 1, size = 10, searchKey } = query;
    const albumns = await this.albumnRepository.find({
      where: { name: Like(`%${searchKey || ''}%`) },
      skip: size * (page - 1),
      take: size,
    });
    const totalRecord = await this.albumnRepository.count();
    return new ListResponseData(
      albumns,
      HttpStatus.OK,
      'ok',
      page,
      size,
      totalRecord,
    );
  }

  async findOne(id: string) {
    const result = await this.albumnRepository.findOneBy({ id });
    return new ResponseData(result, HttpStatus.OK, 'ok');
  }

  async update(id: string, updateAlbumnDto: UpdateAlbumnDto) {
    const { name, description } = updateAlbumnDto;
    const albumn = await this.albumnRepository.findOneBy({ id });
    albumn.name = name || albumn.name;
    albumn.description = description || albumn.description;
    await this.albumnRepository.save(albumn);
    return new ResponseData(albumn.id, HttpStatus.OK, 'ok');
  }

  remove(id: number) {
    return `This action removes a #${id} albumn`;
  }
}
