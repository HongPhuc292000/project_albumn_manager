import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from 'src/types';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
