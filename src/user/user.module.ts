import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Albumn } from 'src/albumn/entities/albumn.entity';
import { Photo } from 'src/photo/entities/photo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Albumn, Photo])],
  controllers: [UserController],
  providers: [UserService, JwtService, ConfigService],
})
export class UserModule {}
