import { Test, TestingModule } from '@nestjs/testing';
import { JsonStorageService } from './json-storage.service';

describe('JsonStorageServiceService', () => {
  let service: JsonStorageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JsonStorageService],
    }).compile();

    service = module.get<JsonStorageService>(JsonStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
