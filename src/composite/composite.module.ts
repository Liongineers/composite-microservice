import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompositeController } from './composite.controller';
import { CompositeService } from './composite.service';
import { UsersClientService } from '../services/users-client.service';
import { ProductsClientService } from '../services/products-client.service';
import { ReviewsClientService } from '../services/reviews-client.service';

@Module({
  imports: [HttpModule],
  controllers: [CompositeController],
  providers: [
    CompositeService,
    UsersClientService,
    ProductsClientService,
    ReviewsClientService,
  ],
})
export class CompositeModule {}

