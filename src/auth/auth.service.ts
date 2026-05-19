import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
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
      full_name: user.full_name,
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

  async register(registerDto: { full_name: string; email: string; phone?: string; password: string; is_active?: boolean }) {
    // Get the "Client" role by default (role_name = 'Client')
    const clientRole = await this.rolesService.findByName('Client');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create the user
    const user = await this.usersService.create({
      full_name: registerDto.full_name,
      email: registerDto.email,
      phone: registerDto.phone,
      password_hash: hashedPassword,
      id_rol: clientRole.id_rol,
      is_active: registerDto.is_active ?? true,
    });

    // Return user without password
    const { password_hash, ...result } = user;
    return result;
  }
}
