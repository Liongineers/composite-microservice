import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductsClientService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(ProductsClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'services.products',
      'http://localhost:3002',
    );
  }

  async getProduct(productId: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products/${productId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch product ${productId}: ${error.message}`,
      );
      throw new HttpException(
        error.response?.data || 'Products service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async getProducts(params?: any): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products`, { params }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch products: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Products service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async getProductsBySeller(sellerId: string): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/products/seller/${sellerId}`),
      );
      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to fetch products for seller ${sellerId}: ${error.message}`,
      );
      return [];
    }
  }

  async createProduct(productData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/products`, productData),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Products service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async searchProducts(searchDto: any): Promise<any[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/products/search`, searchDto),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to search products: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Products service unavailable',
        error.response?.status || 503,
      );
    }
  }
}
