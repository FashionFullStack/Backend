import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Add global prefix for API routes
  app.setGlobalPrefix('api');

  // Enable cookie parsing
  app.use(cookieParser());

  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Configure Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Fashion E-commerce API')
    .setDescription('API documentation for the Fashion E-commerce platform')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Products')
    .addTag('Orders')
    .addTag('Cart')
    .addTag('Wishlist')
    .addTag('Admin')
    .addTag('Store')
    .addTag('Consumer')
    .addTag('Visualization')
    .addTag('Chat')
    .addTag('Analytics')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
