import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const userExists = await this.usersService.findByEmail(dto.email);
    if (userExists) {
      throw new ConflictException('El email ya está registrado');
    }

    if (typeof dto.password !== 'string') {
      throw new Error('Password must be a string');
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.createUser({
      ...dto,
      password: hashedPassword,
    });
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
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
}
