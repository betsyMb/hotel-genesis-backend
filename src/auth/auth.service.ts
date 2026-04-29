import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password_hash, ...result } = user;
    return result;
  }

  async login(loginDto: { email: string; password: string }) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const payload = {
      sub: user.id_user,
      email: user.email,
      id_rol: user.id_rol,
      role: user.role.role_name,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id_user: user.id_user,
        full_name: user.full_name,
        email: user.email,
        role: user.role.role_name,
      },
    };
  }
}
