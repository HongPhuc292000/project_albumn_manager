import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonQuery, ListResponseData, ResponseData } from 'src/types';
import { Like, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Albumn } from 'src/albumn/entities/albumn.entity';
import { Photo } from 'src/photo/entities/photo.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Albumn) private albumnRepository: Repository<Albumn>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
  ) {}

  async getProfile(id: string) {
    const profile = await this.userRepository.findOneBy({ id });
    if (!profile) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }
    return new ResponseData(profile, HttpStatus.OK, 'ok');
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const { name, password, repeatedPassword } = updateUserDto;
    const profile = await this.userRepository.findOneBy({ id });
    if (!profile) {
      throw new HttpException('not found', HttpStatus.NOT_FOUND);
    }

    profile.name = name || profile.name;

    if (password && !repeatedPassword) {
      throw new HttpException(
        'repeatedPassword is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (password && password !== repeatedPassword) {
      throw new HttpException(
        'repeatedPassword is not match',
        HttpStatus.BAD_REQUEST,
      );
    }

    profile.password = password || profile.password;

    await this.userRepository.save(profile);

    return new ResponseData(profile.id, HttpStatus.OK, 'ok');
  }

  async follow(partnerId: string, userId: string) {
    if (partnerId === userId) {
      throw new HttpException('can not follow myself', HttpStatus.BAD_REQUEST);
    }

    const partner = await this.userRepository.findOneBy({ id: partnerId });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        users: true,
      },
    });

    if (!partner) {
      throw new HttpException('not found partner', HttpStatus.NOT_FOUND);
    }

    const isFollowed = user.users.find((user) => user.id === partnerId);
    if (isFollowed) {
      user.users = user.users.filter((user) => user.id !== partnerId);
    } else {
      user.users = [...user.users, partner];
    }

    await this.userRepository.save(user);

    return new ResponseData('success', HttpStatus.OK, 'ok');
  }

  async joinAlbumn(albumnId: string, userId: string) {
    const albumn = await this.albumnRepository.findOneBy({ id: albumnId });
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        albumns: true,
      },
    });

    if (!albumn) {
      throw new HttpException('not found albumn', HttpStatus.NOT_FOUND);
    }

    const isJoined = user.albumns.find((albumn) => albumn.id === albumnId);
    if (isJoined) {
      user.albumns = user.albumns.filter((albumn) => albumn.id !== albumnId);
    } else {
      user.albumns = [...user.albumns, albumn];
    }

    await this.userRepository.save(user);

    return new ResponseData('success', HttpStatus.OK, 'ok');
  }

  async getNewFeed(id: string, query: CommonQuery) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        users: true,
      },
    });

    const { page = 1, size = 10 } = query;

    const follwedUsers = user.users.map((user) => user.id);

    const photos = await this.photoRepository
      .createQueryBuilder('photo')
      .where('photo.userId IN (:...follwedUsers)', { follwedUsers })
      .orderBy('photo.createdAt', 'DESC')
      .skip(size * (page - 1))
      .take(size)
      .getMany();

    return new ListResponseData(photos, HttpStatus.OK, 'ok', page, size);
  }
}
