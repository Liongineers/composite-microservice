import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewsClientService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(ReviewsClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'services.reviews',
      'http://localhost:3003',
    );
  }

  async getReview(reviewId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/reviews/${reviewId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch review ${reviewId}: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Reviews service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async getReviewsBySeller(sellerId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/reviews/seller/${sellerId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch reviews for seller ${sellerId}: ${error.message}`,
      );
      return [];
    }
  }

  async getReviewsByWriter(writerId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/reviews/mine`, {
          headers: { 'X-User-Id': writerId },
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch reviews by writer ${writerId}: ${error.message}`,
      );
      return [];
    }
  }

  async createReview(reviewData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/reviews`, reviewData),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create review: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Reviews service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async deleteReview(reviewId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.baseUrl}/reviews/${reviewId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to delete review ${reviewId}: ${error.message}`,
      );
      throw new HttpException(
        error.response?.data || 'Reviews service unavailable',
        error.response?.status || 503,
      );
    }
  }
}
