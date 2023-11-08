import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { ResponseData } from 'src/types';
import { Albumn } from 'src/albumn/entities/albumn.entity';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Albumn) private albumnRepository: Repository<Albumn>,
  ) {}

  async create(createPhotoDto: CreatePhotoDto, userId: string) {
    const { albumnId, ...rest } = createPhotoDto;

    const user = await this.userRepository.findOneBy({ id: userId });
    const albumn = await this.albumnRepository.findOneBy({ id: albumnId });

    if (!albumn) {
      throw new HttpException('not found albumn', HttpStatus.BAD_REQUEST);
    }

    const newPhoto = this.photoRepository.create(rest);
    newPhoto.user = user;

    if (albumnId) {
      newPhoto.albumn = albumn;
    }

    const savedPhoto = await this.photoRepository.save(newPhoto);

    return new ResponseData(savedPhoto.id, HttpStatus.CREATED, 'ok');
  }

  findAll() {
    return `This action returns all photo`;
  }

  async findOne(id: string) {
    const photo = await this.photoRepository.findOneBy({ id });

    if (!photo || !photo.status) {
      throw new HttpException('not found photo', HttpStatus.NOT_FOUND);
    }
    return new ResponseData(photo, HttpStatus.OK, 'ok');
  }

  async update(id: string, updatePhotoDto: UpdatePhotoDto) {
    const { name, link, albumnId } = updatePhotoDto;
    const photo = await this.photoRepository.findOneBy({ id });
    const albumn = await this.albumnRepository.findOneBy({ id: albumnId });

    if (!photo || !photo.status) {
      throw new HttpException('not found photo', HttpStatus.NOT_FOUND);
    }

    photo.name = name || photo.name;
    photo.link = link || photo.link;

    if (albumn) {
      photo.albumn = albumn;
    }

    const savedPhoto = await this.photoRepository.save(photo);

    return new ResponseData(savedPhoto.id, HttpStatus.OK, 'ok');
  }

  async likePhoto(photoId: string, userId: string) {
    const photo = await this.photoRepository.findOneBy({ id: photoId });
    if (!photo || !photo.status) {
      throw new HttpException('not found photo', HttpStatus.NOT_FOUND);
    }

    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        likedPhotos: true,
      },
    });

    const isLiked = user.likedPhotos.find((photo) => photo.id === photoId);
    if (isLiked) {
      user.likedPhotos = user.likedPhotos.filter(
        (photo) => photo.id !== photoId,
      );
    } else {
      user.likedPhotos = [...user.likedPhotos, photo];
    }

    await this.userRepository.save(user);

    return new ResponseData('success', HttpStatus.OK, 'ok');
  }

  async remove(id: string) {
    const photo = await this.photoRepository.findOneBy({ id });

    if (!photo) {
      throw new HttpException('not found photo', HttpStatus.NOT_FOUND);
    }

    photo.status = 0;
    await this.photoRepository.save(photo);
    return new ResponseData('deleted', HttpStatus.OK, 'ok');
  }
}
