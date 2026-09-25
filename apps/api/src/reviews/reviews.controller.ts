import { Controller, Get, Patch, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AdminAuthGuard } from '../auth/guards/admin-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /** Admin: list all reviews with optional status/search filters */
  @Get('admin/all')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async getAllReviews(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.reviewsService.getAllReviews({ status, search });
  }

  /** Admin: moderate a review (APPROVED / FLAGGED / PENDING) */
  @Patch('admin/:id/status')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async moderateReview(
    @Param('id') id: string,
    @Body('status') status: 'APPROVED' | 'FLAGGED' | 'PENDING',
  ) {
    return this.reviewsService.moderateReview(id, status);
  }

  /** Admin: manually add an external review (Google) */
  @Post('admin/external')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async addExternalReview(
    @Body() dto: {
      travelerName: string;
      rating: number;
      text: string;
      target: string;
      source: 'GOOGLE';
    }
  ) {
    return this.reviewsService.addExternalReview(dto);
  }

  /**
   * Admin: trigger a live sync of Google Place reviews → DB.
   * Protected so only authenticated admins can force a re-sync.
   * The Google API key is read server-side from env — never exposed to clients.
   */
  @Post('admin/sync-google')
  @UseGuards(AdminAuthGuard, PermissionsGuard)
  @RequirePermissions('reviews.manage')
  async syncGoogleReviews() {
    return this.reviewsService.syncGoogleReviews();
  }


  /** Public: approved featured reviews for website social proof */
  @Get('featured')
  async getFeaturedReviews() {
    return this.reviewsService.getFeaturedReviews();
  }
}
