import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [HttpModule, ConfigModule, PrismaModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
