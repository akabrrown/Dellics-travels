import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthTokenService } from '../auth/auth-token.service';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogController],
  providers: [CatalogService, AuthTokenService],
  exports: [CatalogService],
})
export class CatalogModule {}

