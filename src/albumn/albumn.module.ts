import { Module } from '@nestjs/common';
import { AlbumnService } from './albumn.service';
import { AlbumnController } from './albumn.controller';

@Module({
  controllers: [AlbumnController],
  providers: [AlbumnService],
})
export class AlbumnModule {}
