import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HotelDumpService } from './hotel-dump/hotel-dump.service';

async function bootstrap() {
  console.log('Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const dumpService = app.get(HotelDumpService);
  
  console.log('Triggering full hotel dump sync (this will take a few minutes)...');
  try {
    await dumpService.syncDump('full');
    console.log('Successfully completed hotel dump sync!');
  } catch (error) {
    console.error('Failed to run hotel dump sync:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
