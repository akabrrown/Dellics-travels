import { Controller, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('admin/all')
  async getAllReviews(
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.reviewsService.getAllReviews({ status, search });
  }

  @Patch('admin/:id/status')
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
