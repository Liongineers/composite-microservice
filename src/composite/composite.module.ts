import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompositeController } from './composite.controller';
import { AuthController } from './auth.controller';
import { CompositeService } from './composite.service';
import { UsersClientService } from '../services/users-client.service';
import { ProductsClientService } from '../services/products-client.service';
import { ReviewsClientService } from '../services/reviews-client.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CompositeController, AuthController],
  providers: [
    CompositeService,
    UsersClientService,
    ProductsClientService,
    ReviewsClientService,
  ],
})
export class CompositeModule {}
