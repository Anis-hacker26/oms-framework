import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import {
  AppConfigService,
} from './modules/config/services/app-config.service';

async function bootstrap() {
const app = await NestFactory.create(AppModule);

const configService =
  app.get(AppConfigService);

app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('OMS Framework API')
    .setDescription(
      'Enterprise Order Management System Framework API Documentation',
    )
    .setVersion('1.0.0')
    .addTag('Tenants')
    .addTag('Authentication')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT access token',
      },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(
  configService.app.port,
);

console.log(
  `🚀 Swagger available at http://localhost:${configService.app.port}/api`,
);
}

void bootstrap();
