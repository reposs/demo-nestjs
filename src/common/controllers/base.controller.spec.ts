import { Test, TestingModule } from '@nestjs/testing';
import { BaseController } from './base.controller';
import { Controller, Logger } from '@nestjs/common';

@Controller('test')
class TestController extends BaseController {}

describe('BaseController', () => {
  let controller: TestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [Logger],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
