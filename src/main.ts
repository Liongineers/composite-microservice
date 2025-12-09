import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';

async function bootstrap() {
  console.log('Starting bootstrap...');
  console.log('PORT env variable:', process.env.PORT);

  const app = await NestFactory.create(AppModule);
  console.log('NestJS app created');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Composite Microservice API')
    .setDescription(
      'Composite service that aggregates Users, Products, and Reviews microservices',
    )
    .setVersion('1.0')
    .addTag(
      'composite',
      'Composite endpoints with parallel execution and FK validation',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  console.log('Swagger configured');

  const port = parseInt(process.env.PORT || '8080', 10);
  console.log(`Attempting to listen on 0.0.0.0:${port}`);
  await app.listen(port, '0.0.0.0');
  console.log(`SUCCESS: Composite microservice running on port ${port}`);
  console.log(`Swagger documentation available at /api/docs`);
}
bootstrap().catch((err) => {
  console.error('FATAL ERROR during bootstrap:', err);
  process.exit(1);
});
