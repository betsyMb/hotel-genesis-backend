import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Occupancy } from './entities/occupancy.entity';
import { CreateOccupancyDto } from './dto/create-occupancy.dto';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';

@Injectable()
export class OccupanciesService {
  constructor(
    @InjectRepository(Occupancy)
    private readonly occupancyRepository: Repository<Occupancy>,
  ) {}

  async create(createOccupancyDto: CreateOccupancyDto): Promise<Occupancy> {
    const occupancy = this.occupancyRepository.create(createOccupancyDto);
    return await this.occupancyRepository.save(occupancy);
  }

  async findAll(): Promise<Occupancy[]> {
    return await this.occupancyRepository.find({
      relations: ['reservation', 'room'],
    });
  }

  async findOne(id: number): Promise<Occupancy> {
    const occupancy = await this.occupancyRepository.findOne({
      where: { id_occupancy: id },
      relations: ['reservation', 'room'],
    });
    if (!occupancy)
      throw new NotFoundException(`Occupancy with ID ${id} not found`);
    return occupancy;
  }

  async update(
    id: number,
    updateOccupancyDto: UpdateOccupancyDto,
  ): Promise<Occupancy> {
    const occupancy = await this.findOne(id);
    Object.assign(occupancy, updateOccupancyDto);
    return await this.occupancyRepository.save(occupancy);
  }

  async remove(id: number): Promise<void> {
    const occupancy = await this.findOne(id);
    await this.occupancyRepository.remove(occupancy);
  }

  async findByRoomAndStatus(
    roomId: number,
    status: string,
  ): Promise<Occupancy[]> {
    return await this.occupancyRepository.find({
      where: { id_room: roomId, occupancy_status: status },
      relations: ['reservation', 'room'],
    });
  }

  async findCompletedWalkIns(): Promise<Occupancy[]> {
    return await this.occupancyRepository.find({
      where: { occupancy_status: 'completed' },
      relations: ['room', 'reservation'],
      order: { actual_check_out: 'DESC' },
    });
  }
}
