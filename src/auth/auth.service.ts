import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { sendActivationEmail, sendResetPasswordEmail } from 'src/utils/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(dto.email);
    if (userExists) throw new ConflictException('El email ya está registrado');

    // Crear usuario temporalmente (sin password, inactivo)
    const user = await this.usersService.createUser({
      ...dto,
      password: '', // aún no tiene
    });

    // Crear token de activación
    const token = this.jwtService.sign(
      { email: user.email, purpose: 'activation' },
      { expiresIn: '24h' },
    );

    // Enviar correo
    await sendActivationEmail(user.email, token);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async activateAccount(token: string, password: string) {
    let payload: { email: string; purpose: string };

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    const { email, purpose } = payload;

    if (purpose !== 'activation' && purpose !== 'reset-password') {
      throw new UnauthorizedException('Propósito del token inválido');
    }

    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new ConflictException('Cuenta no activa o inexistente');
    }

    if (purpose === 'activation') {
      if (user.isActive) {
        throw new ConflictException('Cuenta ya activada');
      }
      user.isActive = true;
    }

    if (purpose === 'reset-password') {
      if (!user.isActive) {
        throw new ConflictException('Cuenta no activa');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await this.usersService.saveUser(user);

    return null;
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.password)) ||
      !user.isActive
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role.name };
    const accessToken = await this.jwtService.signAsync(payload);

    const { password, createdAt, updateAt, ...userWithoutSensibleProperties } =
      user;

    return {
      ...userWithoutSensibleProperties,
      accessToken,
    };
  }

  async resetPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const token = this.jwtService.sign(
      { email: user.email, purpose: 'reset-password' },
      { expiresIn: '24h' },
    );

    // Enviar correo
    await sendResetPasswordEmail(user.email, token);
  }
}
