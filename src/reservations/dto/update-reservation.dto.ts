import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @ApiProperty({
    example: 'pending',
    description: 'Reservation status',
    required: false,
  })
  reservation_status?: string;
}
