import { Test, TestingModule } from '@nestjs/testing';
import { DigitalHumanModelsController } from './digital-human-models.controller';

describe('DigitalHumanModelsController', () => {
  let controller: DigitalHumanModelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DigitalHumanModelsController],
    }).compile();

    controller = module.get<DigitalHumanModelsController>(DigitalHumanModelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
