import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'secretKey'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    UsersModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [AuthService, RolesGuard, JwtAuthGuard],
})
export class AuthModule {}
