import {
  HttpCode,
  HttpStatus,
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JWTPayload, ListResponseData, ResponseData } from 'src/types';
import { AlbumnQuery } from 'src/types/Albumn';
import { DataSource, Like, Repository } from 'typeorm';
import { CreateAlbumnDto } from './dto/create-albumn.dto';
import { UpdateAlbumnDto } from './dto/update-albumn.dto';
import { Albumn } from './entities/albumn.entity';
import { User } from 'src/user/entities/user.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { BaseService } from 'src/services/baseCRUD.service';

@Injectable()
export class AlbumnService extends BaseService<Albumn> {
  constructor(
    @InjectRepository(Albumn) private albumnRepository: Repository<Albumn>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {
    super(albumnRepository);
  }

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
      throw new InternalServerErrorException();
    }
  }

  async findAllAlbumns(query: AlbumnQuery, userId: string) {
    const { page = 1, size = 10, searchKey = '' } = query;
    const results = this.findAll(
      `SELECT * FROM albumn INNER JOIN user_salbumn ON albumn.id = user_albumn."albumnId" WHERE user_albumn."userId" = '${userId}' AND LOWER(albumn.name) LIKE LOWER('%${searchKey}%') OFFSET ${
        (page - 1) * size
      } ROWS FETCH NEXT ${size} ROWS ONLY`,
      page,
      size,
    );
    return results;
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
