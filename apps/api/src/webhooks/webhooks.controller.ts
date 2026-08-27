import { Controller, Post, Body, Headers } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('stripe')
  async handleStripeWebhook(
    @Headers('stripe-signature') signature: string,
    @Body() body: any,
  ) {
    // Note: In a real implementation, we would use the raw body to verify the signature.
    // For MVP scaffolding, we parse the body directly.
    return this.webhooksService.handleStripeWebhook(signature, body);
  }
}
