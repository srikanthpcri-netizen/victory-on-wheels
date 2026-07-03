import { Test, TestingModule } from '@nestjs/testing';
import { AddOnService } from './add-on.service';

describe('AddOnService', () => {
  let service: AddOnService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddOnService],
    }).compile();

    service = module.get<AddOnService>(AddOnService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
