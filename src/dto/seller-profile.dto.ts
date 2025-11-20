import { ApiProperty } from '@nestjs/swagger';

export class SellerStatisticsDto {
  @ApiProperty({ example: 10 })
  totalProducts: number;

  @ApiProperty({ example: 4.5 })
  averageRating: number;

  @ApiProperty({ example: 20 })
  totalReviews: number;
}

export class SellerProfileDto {
  @ApiProperty()
  seller: any;

  @ApiProperty({ type: [Object] })
  products: any[];

  @ApiProperty({ type: [Object] })
  reviews: any[];

  @ApiProperty({ type: SellerStatisticsDto })
  statistics: SellerStatisticsDto;
}

