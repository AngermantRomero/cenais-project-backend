import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm';
import { Role } from 'src/roles/entities/roles.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createUser(userDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: userDto.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const role = await this.roleRepository.findOne({
      where: { id: userDto.role },
    });

    if (!role) {
      throw new NotFoundException(`El rol con ID ${userDto.role} no existe`);
    }

    // Separar los datos del usuario, excluyendo el UUID del rol
    const { role: _, ...rest } = userDto;

    const newUser = this.userRepository.create({
      ...rest,
      role,
    });

    return await this.userRepository.save(newUser);
  }

  async getUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return this.userRepository.delete(id);
  }
  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.getUser(id);

    if (userDto.email && userDto.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: userDto.email },
      });
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    let role;
    if (userDto.role) {
      role = await this.roleRepository.findOne({ where: { id: userDto.role } });
      if (!role) {
        throw new NotFoundException(`El rol con ID ${userDto.role} no existe`);
      }
    }

    const { role: _, ...rest } = userDto;

    await this.userRepository.update(id, {
      ...rest,
      ...(role && { role }),
    });

    return this.userRepository.findOneByOrFail({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }
}
