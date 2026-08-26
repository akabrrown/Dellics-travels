import { Module } from '@nestjs/common';
import { EsimController } from './esim.controller';
import { EsimService } from './esim.service';

@Module({
  controllers: [EsimController],
  providers: [EsimService]
})
export class EsimModule {}
