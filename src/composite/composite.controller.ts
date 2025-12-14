import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CompositeService } from './composite.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { SellerProfileDto } from '../dto/seller-profile.dto';
import { ProductDetailsDto } from '../dto/product-details.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@ApiTags('composite')
@Controller('api')
export class CompositeController {
  constructor(private readonly compositeService: CompositeService) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getUsers(@Req() req: Request): Promise<any[]> {
    const authHeader = req.headers.authorization;
    const headers = authHeader ? { authorization: authHeader } : {};
    return await this.compositeService.getUsers(headers);
  }

  @Post('users')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return await this.compositeService.createUser(createUserDto);
  }

  @Patch('users/:userId')
  @ApiOperation({ summary: 'Update user information' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(@Param('userId') userId: string, @Body() updateData: any, @Req() req: Request): Promise<any> {
    const authHeader = req.headers.authorization;
    const headers = authHeader ? { authorization: authHeader } : {};
    return await this.compositeService.updateUser(userId, updateData, headers);
  }

  @Get('sellers/:sellerId/profile')
  @ApiOperation({ summary: 'Get seller profile with products and reviews (PARALLEL EXECUTION)' })
  @ApiParam({ name: 'sellerId', description: 'Seller UUID' })
  @ApiResponse({ status: 200, description: 'Seller profile retrieved', type: SellerProfileDto })
  @ApiResponse({ status: 404, description: 'Seller not found' })
  async getSellerProfile(@Param('sellerId') sellerId: string): Promise<SellerProfileDto> {
    return await this.compositeService.getSellerProfile(sellerId);
  }

  @Get('products/:productId/details')
  @ApiOperation({ summary: 'Get product details with seller info and reviews (PARALLEL EXECUTION)' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product details retrieved', type: ProductDetailsDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async getProductDetails(@Param('productId') productId: string): Promise<ProductDetailsDto> {
    return await this.compositeService.getProductDetails(productId);
  }

  @Post('products')
  @ApiOperation({ summary: 'Create product with FK validation' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created with seller info' })
  @ApiResponse({ status: 400, description: 'Seller does not exist' })
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<any> {
    return await this.compositeService.createProduct(createProductDto);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Create review with FK validation' })
  @ApiBody({ type: CreateReviewDto })
  @ApiResponse({ status: 201, description: 'Review created' })
  @ApiResponse({ status: 400, description: 'Writer or seller does not exist' })
  async createReview(@Body() createReviewDto: CreateReviewDto): Promise<any> {
    console.log('Received review data:', JSON.stringify(createReviewDto));
    console.log('writer_id type:', typeof createReviewDto.writer_id, 'value:', createReviewDto.writer_id);
    return await this.compositeService.createReview(createReviewDto);
  }

  @Delete('users/:userId')
  @ApiOperation({ summary: 'Delete user with dependency checks' })
  @ApiParam({ name: 'userId', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 409, description: 'Cannot delete user with dependencies' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('userId') userId: string, @Req() req: Request): Promise<any> {
    const authHeader = req.headers.authorization;
    const headers = authHeader ? { authorization: authHeader } : {};
    return await this.compositeService.deleteUser(userId, headers);
  }

  @Get('products/search')
  @ApiOperation({ summary: 'Search products with seller enrichment (PARALLEL EXECUTION)' })
  @ApiQuery({ name: 'query', description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Products with seller info' })
  async searchProducts(@Query('query') query: string): Promise<any[]> {
    return await this.compositeService.searchProducts(query);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Missing token' })
  @ApiResponse({ status: 403, description: 'Invalid token' })
  async getProfile(@Req() req: any): Promise<any> {
    return { user: req.user };
  }
}

