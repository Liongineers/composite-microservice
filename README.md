# Composite Microservice

NestJS-based composite service that aggregates Users, Products, and Reviews microservices with parallel execution and foreign key validation.

## Overview

This service encapsulates three atomic microservices and provides:
- Aggregated data endpoints with parallel execution
- Logical foreign key constraints across distributed services
- Service orchestration and error handling

## API Endpoints

### GET /api/sellers/:sellerId/profile
Fetch seller profile with products and reviews using parallel execution.

**Response:**
```json
{
  "seller": { "user_id": "...", "name": "...", ... },
  "products": [ ... ],
  "reviews": [ ... ],
  "statistics": {
    "totalProducts": 10,
    "averageRating": 4.5,
    "totalReviews": 20
  }
}
```

### GET /api/products/:productId/details
Get product details with seller info and reviews using parallel execution.

**Response:**
```json
{
  "product": { "product_id": "...", ... },
  "seller": { "user_id": "...", ... },
  "sellerReviews": [ ... ],
  "sellerStats": {
    "averageRating": 4.5,
    "totalReviews": 15
  }
}
```

### POST /api/products
Create a product with foreign key validation.

**Request Body:**
```json
{
  "product_name": "Laptop",
  "category": "Electronics",
  "seller_id": "uuid",
  "description": "Great laptop",
  "availability": 1,
  "price": 299.99,
  "condition": "Used",
  "quantity": 1
}
```

**Validation:** Ensures seller_id exists in users service before creating product.

### POST /api/reviews
Create a review with foreign key validation.

**Request Body:**
```json
{
  "writer_id": "uuid",
  "seller_id": "uuid",
  "rating": 5,
  "comment": "Great seller!"
}
```

**Validation:** Ensures both writer_id and seller_id exist in users service.

### DELETE /api/users/:userId
Delete user with dependency checks.

**Validation:** Checks for:
- Products where user is seller
- Reviews written by user
- Reviews received by user

Returns 409 Conflict if dependencies exist.

### GET /api/products/search?query=...
Search products with seller information enrichment using parallel execution.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
Create `.env` file:
```
PORT=3000
USERS_SERVICE_URL=http://136.119.107.45:8080
PRODUCTS_SERVICE_URL=https://products-microservice-471529071641.us-east1.run.app
REVIEWS_SERVICE_URL=https://reviews-microservice-471529071641.us-east1.run.app
```

### 3. Run the service
```bash
npm run start:dev
```

Service runs on `http://localhost:3000`

Swagger docs: `http://localhost:3000/api/docs`

## Technologies

- NestJS
- TypeScript
- Axios HTTP client
- class-validator
- Swagger/OpenAPI

## Deployment

### Cloud Run
```bash
gcloud run deploy composite-service --source . --region us-central1
```

### App Engine
Create `app.yaml` and run `gcloud app deploy`
