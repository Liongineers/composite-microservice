export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  services: {
    users: process.env.USERS_SERVICE_URL || 'http://localhost:3001',
    products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
    reviews: process.env.REVIEWS_SERVICE_URL || 'http://localhost:3003',
  },
});

