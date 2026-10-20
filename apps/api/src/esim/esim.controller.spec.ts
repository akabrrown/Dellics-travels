import { Test, TestingModule } from '@nestjs/testing';
import { EsimController } from './esim.controller';
import { EsimService } from './esim.service';

describe('EsimController', () => {
  let controller: EsimController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EsimController],
      providers: [{ provide: EsimService, useValue: {} }],
    }).compile();

    controller = module.get<EsimController>(EsimController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
