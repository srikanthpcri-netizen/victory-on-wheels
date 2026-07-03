import { Test, TestingModule } from '@nestjs/testing';
import { SparePartRequestController } from './spare-part-request.controller';

describe('SparePartRequestController', () => {
  let controller: SparePartRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SparePartRequestController],
    }).compile();

    controller = module.get<SparePartRequestController>(SparePartRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
