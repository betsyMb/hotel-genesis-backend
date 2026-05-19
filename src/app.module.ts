import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { ReservationsModule } from './reservations/reservations.module';
import { OccupanciesModule } from './occupancies/occupancies.module';
import { ServicesModule } from './services/services.module';
import { PromotionsModule } from './promotions/promotions.module';
import { WalkinModule } from './walkin/walkin.module';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USERNAME', 'hotel_admin'),
        password: config.get('DB_PASSWORD', 'hotel_secure_password_2024'),
        database: config.get('DB_DATABASE', 'hotel_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        logging: true,
      }),
    }),
    AuthModule,
    RolesModule,
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
