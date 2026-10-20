import { Controller, Post, Body, Headers } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('paystack')
  @Post('stripe')
  async handleWebhook(
    @Headers('x-paystack-signature') paystackSig: string,
    @Headers('stripe-signature') stripeSig: string,
    @Body() body: any,
  ) {
    const signature = paystackSig || stripeSig || '';
    return this.webhooksService.handlePaystackWebhook(signature, body);
  }

  @Post('airalo')
  async handleAiraloWebhook(@Body() body: any) {
    return this.webhooksService.handleAiraloWebhook(body);
  }
}
