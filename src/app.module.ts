import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OccupanciesModule } from './occupancies/occupancies.module';
import { ServicesModule } from './services/services.module';
import { PromotionsModule } from './promotions/promotions.module';
import { WalkinModule } from './walkin/walkin.module';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const dbHost = config.get<string>('DB_HOST', 'localhost');
        const dbPort = config.get('DB_PORT', 5432);
        const dbUser = config.get<string>('DB_USERNAME', 'hotel_admin');
        const dbName = config.get<string>('DB_DATABASE', 'hotel_db');
        const dbSslRaw = config.get<string>('DB_SSL', 'false');
        const isNeon = dbHost.includes('neon.tech');
        const sslEnabled = dbSslRaw === 'true' || isNeon;

        console.log('=== DB CONFIG ===');
        console.log('Host:', dbHost);
        console.log('Port:', dbPort);
        console.log('User:', dbUser);
        console.log('Database:', dbName);
        console.log('DB_SSL raw:', dbSslRaw);
        console.log('Is Neon:', isNeon);
        console.log('SSL enabled:', sslEnabled);
        console.log('================');

        return {
          type: 'postgres',
          host: dbHost,
          port: dbPort,
          username: dbUser,
          password: config.get('DB_PASSWORD', 'hotel_secure_password_2024'),
          database: dbName,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: true,
        };
      },
    }),
    AuthModule,
    RolesModule,
    NotificationsModule,
    UsersModule,
    RoomsModule,
    ReservationsModule,
    OccupanciesModule,
    ServicesModule,
    PromotionsModule,
    WalkinModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
