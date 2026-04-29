import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OccupanciesService } from './occupancies.service';
import { OccupanciesController } from './occupancies.controller';
import { Occupancy } from './entities/occupancy.entity';
import { ReservationsModule } from '../reservations/reservations.module';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Occupancy]),
    ReservationsModule,
    RoomsModule,
  ],
  controllers: [OccupanciesController],
  providers: [OccupanciesService],
  exports: [OccupanciesService],
})
export class OccupanciesModule {}
