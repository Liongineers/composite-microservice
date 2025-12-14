import {
  Injectable,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UsersClientService } from '../services/users-client.service';
import { ProductsClientService } from '../services/products-client.service';
import { ReviewsClientService } from '../services/reviews-client.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateReviewDto } from '../dto/create-review.dto';
import { SellerProfileDto } from '../dto/seller-profile.dto';
import { ProductDetailsDto } from '../dto/product-details.dto';

@Injectable()
export class CompositeService {
  private readonly logger = new Logger(CompositeService.name);

  constructor(
    private readonly usersClient: UsersClientService,
    private readonly productsClient: ProductsClientService,
    private readonly reviewsClient: ReviewsClientService,
  ) {}

  async getUsers(): Promise<any[]> {
    this.logger.log('Fetching all users from Users microservice');
    const response = await this.usersClient.getUsers();
    // Users service returns paginated response with data array
    return response.data || [];
  }

  async createUser(createUserDto: any): Promise<any> {
    this.logger.log(`Creating new user: ${createUserDto.name}`);
    return await this.usersClient.createUser(createUserDto);
  }

  async getSellerProfile(sellerId: string): Promise<SellerProfileDto> {
    this.logger.log(
      `Fetching seller profile for ${sellerId} with PARALLEL execution`,
    );

    // PARALLEL EXECUTION: Fetch data from all three services simultaneously
    const [seller, products, reviews] = await Promise.all([
      this.usersClient.getUser(sellerId),
      this.productsClient.getProductsBySeller(sellerId),
      this.reviewsClient.getReviewsBySeller(sellerId),
    ]);

    // Enrich reviews with writer information
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        try {
          const writer = await this.usersClient.getUser(review.writer_id);
          return {
            ...review,
            writer_name: writer.name,
          };
        } catch (error) {
          this.logger.warn(`Failed to fetch writer ${review.writer_id}: ${error.message}`);
          return {
            ...review,
            writer_name: 'Anonymous',
          };
        }
      }),
    );

    // Calculate statistics
    const totalProducts = products.length;
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + (r.rating || r.stars || 0), 0) / totalReviews
        : 0;

    return {
      seller,
      products,
      reviews: enrichedReviews,
      statistics: {
        totalProducts,
        averageRating: Number(averageRating.toFixed(2)),
        totalReviews,
      },
    };
  }

  async getProductDetails(productId: string): Promise<ProductDetailsDto> {
    this.logger.log(
      `Fetching product details for ${productId} with PARALLEL execution`,
    );

    // First get the product
    const product = await this.productsClient.getProduct(productId);

    // PARALLEL EXECUTION: Fetch seller info and reviews simultaneously
    const [seller, sellerReviews] = await Promise.all([
      this.usersClient.getUser(product.seller_id),
      this.reviewsClient.getReviewsBySeller(product.seller_id),
    ]);

    // Calculate seller statistics
    const totalReviews = sellerReviews.length;
    const averageRating =
      totalReviews > 0
        ? sellerReviews.reduce((sum, r) => sum + (r.rating || r.stars || 0), 0) / totalReviews
        : 0;

    return {
      product,
      seller,
      sellerReviews,
      sellerStats: {
        averageRating: Number(averageRating.toFixed(2)),
        totalReviews,
      },
    };
  }

  async createProduct(createProductDto: CreateProductDto): Promise<any> {
    this.logger.log(
      `Creating product with FK validation for seller ${createProductDto.seller_id}`,
    );

    // LOGICAL FOREIGN KEY CONSTRAINT: Validate seller exists
    const sellerExists = await this.usersClient.userExists(
      createProductDto.seller_id,
    );
    if (!sellerExists) {
      throw new BadRequestException('Seller does not exist');
    }

    // Delegate to products service
    const product = await this.productsClient.createProduct(createProductDto);

    // Enrich with seller info
    const seller = await this.usersClient.getUser(createProductDto.seller_id);

    return {
      ...product,
      seller_info: seller,
    };
  }

  async createReview(createReviewDto: CreateReviewDto): Promise<any> {
    this.logger.log(
      `Creating review with FK validation for writer ${createReviewDto.writer_id} and seller ${createReviewDto.seller_id}`,
    );

    // LOGICAL FOREIGN KEY CONSTRAINTS: Validate both writer and seller exist in parallel
    const [writerExists, sellerExists] = await Promise.all([
      this.usersClient.userExists(createReviewDto.writer_id),
      this.usersClient.userExists(createReviewDto.seller_id),
    ]);

    if (!writerExists) {
      throw new BadRequestException('Writer does not exist');
    }

    if (!sellerExists) {
      throw new BadRequestException('Seller does not exist');
    }

    // Delegate to reviews service with all fields
    return await this.reviewsClient.createReview(createReviewDto);
  }

  async deleteUser(userId: string): Promise<any> {
    this.logger.log(`Deleting user ${userId} with dependency checks`);

    // LOGICAL FOREIGN KEY CONSTRAINTS: Check dependencies in parallel
    const [products, writtenReviews, receivedReviews] = await Promise.all([
      this.productsClient.getProductsBySeller(userId),
      this.reviewsClient.getReviewsByWriter(userId),
      this.reviewsClient.getReviewsBySeller(userId),
    ]);

    const hasDependencies =
      products.length > 0 ||
      writtenReviews.length > 0 ||
      receivedReviews.length > 0;

    if (hasDependencies) {
      throw new ConflictException({
        message: 'Cannot delete user with dependencies',
        dependencies: {
          products: products.length,
          writtenReviews: writtenReviews.length,
          receivedReviews: receivedReviews.length,
        },
      });
    }

    // No dependencies, safe to delete
    return await this.usersClient.deleteUser(userId);
  }

  async searchProducts(query: string): Promise<any[]> {
    this.logger.log(`Searching products with query: ${query}`);

    // Search products
    const products = await this.productsClient.searchProducts({ query });

    // Get unique seller IDs
    const sellerIds = [...new Set(products.map((p) => p.seller_id))];

    // PARALLEL EXECUTION: Fetch all sellers in parallel
    const sellers = await Promise.all(
      sellerIds.map((id) => this.usersClient.getUser(id).catch(() => null)),
    );

    // Create seller map
    const sellerMap = new Map();
    sellers.forEach((seller, index) => {
      if (seller) {
        sellerMap.set(sellerIds[index], seller);
      }
    });

    // Enrich products with seller info
    return products.map((product) => ({
      ...product,
      seller_info: sellerMap.get(product.seller_id) || null,
    }));
  }

  getUsersServiceUrl(): string {
    return this.usersClient['baseUrl'];
  }
}
