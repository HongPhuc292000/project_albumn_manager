import { Module } from '@nestjs/common';
import { AlbumnService } from './albumn.service';
import { AlbumnController } from './albumn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Albumn } from './entities/albumn.entity';
import { User } from 'src/user/entities/user.entity';
import { Photo } from 'src/photo/entities/photo.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Albumn, User, Photo])],
  controllers: [AlbumnController],
  providers: [AlbumnService, JwtService],
})
export class AlbumnModule {}
