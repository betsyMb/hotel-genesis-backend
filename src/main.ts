import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔓 CONFIGURACIÓN CORS PARA EXPO (menos restrictiva)
  app.enableCors({
    origin: true, // Permitir TODOS los orígenes en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 3600,
  });

  // Opcional: Middleware de seguridad (puedes mantenerlo o comentarlo para probar)
  // app.use((req, res, next) => {
  //   const allowedIPs = ['192.168.0.103', '127.0.0.1', '::1', '192.168.0.102'];
  //   let clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
  //   if (clientIP && clientIP.startsWith('::ffff:')) {
  //     clientIP = clientIP.substring(7);
  //   }
  //   console.log(`📱 Conexión desde: ${clientIP}`);
  //   if (allowedIPs.includes(clientIP)) {
  //     next();
  //   } else {
  //     res.status(403).json({ message: 'Acceso no autorizado' });
  //   }
  // });

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

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`\n✅ Servidor corriendo en:`);
  console.log(`   📍 Local: http://localhost:${port}`);
  console.log(`   📍 Red: http://192.168.0.102:${port}`);
  console.log(`   📱 Expo: http://192.168.0.102:8081`);
  console.log(`   🔓 CORS: Habilitado para todos los orígenes\n`);
}

bootstrap();
