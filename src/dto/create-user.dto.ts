import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'seller' })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ example: '+14155551234' })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  merch: string;
}

