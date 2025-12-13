export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  },
  services: {
    users: process.env.USERS_SERVICE_URL || 'http://34.57.57.27:8080',
    products: process.env.PRODUCTS_SERVICE_URL || 'https://products-microservice-471529071641.us-east1.run.app',
    reviews: process.env.REVIEWS_SERVICE_URL || 'https://reviews-microservice-471529071641.us-east1.run.app',
  },
});
