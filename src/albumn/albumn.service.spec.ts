import { Test, TestingModule } from '@nestjs/testing';
import { AlbumnService } from './albumn.service';

describe('AlbumnService', () => {
  let service: AlbumnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlbumnService],
    }).compile();

    service = module.get<AlbumnService>(AlbumnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
