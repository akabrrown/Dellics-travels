import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { CrmService } from './crm.service';

@Controller('crm')
export class CrmController {
  constructor(private readonly crmService: CrmService) {}

  @Get('customers')
  async getCustomers(
    @Query('search') search?: string,
    @Query('segment') segment?: string,
    @Query('tier') tier?: string,
    @Query('source') source?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.getCustomers({
      search,
      segment,
      tier,
      source,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });
  }

  @Get('customers/:id')
  async getCustomerById(@Param('id') id: string) {
    const customer = await this.crmService.getCustomerById(id);
    if (!customer) {
      return { statusCode: 404, message: 'Customer not found' };
    }
    return customer;
  }

  @Get('customers/:id/interactions')
  async getCustomerInteractions(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.crmService.getCustomerInteractions(
      id,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Get('customers/:id/revenue')
  async getCustomerRevenue(@Param('id') id: string) {
    const revenue = await this.crmService.getCustomerRevenue(id);
    if (!revenue) {
      return { statusCode: 404, message: 'Customer not found' };
    }
    return revenue;
  }

  @Get('pipeline')
  async getPipeline(
    @Query('source') source?: string,
    @Query('agent') agent?: string,
    @Query('stage') stage?: string,
  ) {
    return this.crmService.getPipeline({ source, agent, stage });
  }

  @Patch('pipeline/:id')
  async updateLeadStage(
    @Param('id') id: string,
    @Body()
    body: {
      stage: string;
      assigned_agent?: string;
      notes?: string;
      lost_reason?: string;
    },
  ) {
    return this.crmService.updateLeadStage(id, body);
  }

  @Post('interactions')
  async logInteraction(
    @Body()
    body: {
      user_id?: string;
      channel: string;
      subject: string;
      content: string;
      metadata?: Record<string, any>;
      agent_id?: string;
      inquiry_id?: string;
      booking_id?: string;
    },
  ) {
    return this.crmService.logInteraction(body);
  }

  @Get('stats')
  async getStats() {
    return this.crmService.getStats();
  }
}
