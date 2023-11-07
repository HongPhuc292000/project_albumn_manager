import { Test, TestingModule } from '@nestjs/testing';
import { AlbumnController } from './albumn.controller';
import { AlbumnService } from './albumn.service';

describe('AlbumnController', () => {
  let controller: AlbumnController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlbumnController],
      providers: [AlbumnService],
    }).compile();

    controller = module.get<AlbumnController>(AlbumnController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
