import { Test, TestingModule } from '@nestjs/testing';
import { SparePartRequestService } from './spare-part-request.service';

describe('SparePartRequestService', () => {
  let service: SparePartRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SparePartRequestService],
    }).compile();

    service = module.get<SparePartRequestService>(SparePartRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
