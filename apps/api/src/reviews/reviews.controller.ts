import { Controller, Get, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('admin/all')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async getAllReviews(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.reviewsService.getAllReviews({ status, search });
  }

  @Patch('admin/:id/status')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async moderateReview(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'FLAGGED' | 'PENDING',
  ) {
    return this.reviewsService.moderateReview(id, status);
  }

  @Get('featured')
  async getFeaturedReviews() {
    return this.reviewsService.getFeaturedReviews();
  }
}
