import { Module, forwardRef } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [forwardRef(() => HotelsModule)],
  controllers: [WebhooksController],
  providers: [WebhooksService],
})
export class WebhooksModule {}
