import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { WalkinController } from './walkin.controller';
import { WalkinService } from './walkin.service';
import { WalkInGuest } from './entities/walk-in-guest.entity';
import { RoomsModule } from '../rooms/rooms.module';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { OccupanciesModule } from '../occupancies/occupancies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalkInGuest]),
    RoomsModule,
    UsersModule,
    RolesModule,
    OccupanciesModule,
  ],
  controllers: [WalkinController],
  providers: [WalkinService],
})
export class WalkinModule {}
