import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Hotel App API')
    .setDescription('Hotel Management System API')
    .setVersion('1.0')
    .addTag('roles', 'Roles endpoints')
    .addTag('users', 'Users endpoints')
    .addTag('rooms', 'Rooms endpoints')
    .addTag('reservations', 'Reservations endpoints')
    .addTag('occupancies', 'Occupancies endpoints')
    .addTag('services', 'Services endpoints')
    .addTag('promotions', 'Promotions endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
