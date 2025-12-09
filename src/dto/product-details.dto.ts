import { ApiProperty } from '@nestjs/swagger';

export class SellerStatsDto {
  @ApiProperty({ example: 4.5 })
  averageRating: number;

  @ApiProperty({ example: 15 })
  totalReviews: number;
}

export class ProductDetailsDto {
  @ApiProperty()
  product: any;

  @ApiProperty()
  seller: any;

  @ApiProperty({ type: [Object] })
  sellerReviews: any[];

  @ApiProperty({ type: SellerStatsDto })
  sellerStats: SellerStatsDto;
}
