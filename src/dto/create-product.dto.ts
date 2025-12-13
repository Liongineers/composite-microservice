import { IsString, IsNumber, IsUUID, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop' })
  @IsString()
  product_name: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  category: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  seller_id: string;

  @ApiProperty({
    example: 'Gently used laptop in excellent condition',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1, description: '0 or 1' })
  @IsNumber()
  availability: number;

  @ApiProperty({ example: 299.99 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Used', required: false })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(0)
  quantity: number;
}
