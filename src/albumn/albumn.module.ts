import { Module } from '@nestjs/common';
import { AlbumnService } from './albumn.service';
import { AlbumnController } from './albumn.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Albumn } from './entities/albumn.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Albumn])],
  controllers: [AlbumnController],
  providers: [AlbumnService],
})
export class AlbumnModule {}
