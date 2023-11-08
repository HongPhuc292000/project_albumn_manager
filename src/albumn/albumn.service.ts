import {
  HttpCode,
  HttpStatus,
  Injectable,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListResponseData, ResponseData } from 'src/types';
import { AlbumnQuery } from 'src/types/Albumn';
import { Like, Repository } from 'typeorm';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';
import { Albumn } from './entities/albumn.entity';
import { User } from 'src/user/entities/user.entity';
import { Photo } from 'src/photo/entities/photo.entity';

@Injectable()
export class AlbumnService {
  constructor(
    @InjectRepository(Albumn) private albumnRepository: Repository<Albumn>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}

  @HttpCode(201)
  async create(createAlbumnDto: CreateAlbumnDto, userId: string) {
    try {
      const albumn = this.albumnRepository.create(createAlbumnDto);
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: { albumns: true },
      });
      const savedAlbumn = await this.albumnRepository.save(albumn);
      user.albumns = [...user.albumns, savedAlbumn];
      await this.userRepository.save(user);
      return new ResponseData(savedAlbumn.id, HttpStatus.CREATED, 'ok');
    } catch (error) {
      throw new HttpException('server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
    if (!result) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
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

  async remove(albumnId: string, userId: string) {
    const albumn = await this.albumnRepository.findOneBy({ id: albumnId });
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { albumns: true },
    });

    if (!albumn) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    const userHasJoinAlbumn = user.albumns.find(
      (albumn) => albumn.id === albumnId,
    );
    if (!userHasJoinAlbumn) {
      throw new HttpException('forbidden', HttpStatus.FORBIDDEN);
    }

    if (user.albumns.length > 1) {
      user.albumns = user.albumns.filter((albumn) => albumn.id !== albumnId);
      await this.userRepository.save(user);
      return new ResponseData('deleted', HttpStatus.OK, 'ok');
    } else {
      await this.photoRepository
        .createQueryBuilder()
        .update(Photo)
        .set({ albumn: null })
        .where('albumn = :albumnId', { albumnId })
        .execute();
      await this.albumnRepository.remove(albumn);
      return new ResponseData('deleted', HttpStatus.OK, 'ok');
    }
  }
}
