import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UsersClientService {
  private readonly baseUrl: string;
  private readonly logger = new Logger(UsersClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'services.users',
      'http://localhost:3001',
    );
  }

  async getUser(userId: string, headers?: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users/${userId}`, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch user ${userId}: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Users service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async getUsers(params?: any, headers?: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/users`, { params, headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to fetch users: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Users service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async userExists(userId: string, headers?: any): Promise<boolean> {
    try {
      await this.getUser(userId, headers);
      return true;
    } catch (error) {
      if (error.getStatus() === 404) {
        return false;
      }
      throw error;
    }
  }

  async createUser(userData: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}/users/create_user`, userData),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Users service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async deleteUser(userId: string, headers?: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.baseUrl}/users/${userId}`, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to delete user ${userId}: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Users service unavailable',
        error.response?.status || 503,
      );
    }
  }

  async updateUser(userId: string, updateData: any, headers?: any): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.baseUrl}/users/${userId}`, updateData, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.error(`Failed to update user ${userId}: ${error.message}`);
      throw new HttpException(
        error.response?.data || 'Users service unavailable',
        error.response?.status || 503,
      );
    }
  }
}
