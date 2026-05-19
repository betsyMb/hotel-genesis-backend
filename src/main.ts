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

  // ✅ SOLUCIÓN: Escuchar en todas las interfaces (IPv4 e IPv6)
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Server running on:`);
    console.log(`   - http://localhost:${port}`);
    console.log(`   - http://192.168.68.100:${port}`);
    console.log(`   - http://0.0.0.0:${port}`);
  });
}
bootstrap();
