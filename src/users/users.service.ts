import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (createUserDto.password_hash) {
      createUserDto.password_hash = await bcrypt.hash(
        createUserDto.password_hash,
        10,
      );
    }
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['role'] });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id_user: id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (updateUserDto.password_hash) {
      updateUserDto.password_hash = await bcrypt.hash(
        updateUserDto.password_hash,
        10,
      );
    }
    Object.assign(user, updateUserDto);
    await this.userRepository.save(user);
    return await this.findOne(id);
  }

  async updatePassword(id: number, password: string, currentPassword?: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id_user: id },
      relations: ['role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    if (currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isValid) {
        throw new UnauthorizedException('La contraseña actual no es correcta');
      }
    }
    user.password_hash = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async findByDni(dni: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { dni },
      relations: ['role'],
    });
  }
}
