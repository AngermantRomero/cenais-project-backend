import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const newUser = this.userRepository.create(user);
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
    return this.userRepository.delete(id);
  }
  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    const existingUser = await this.getUser(id);

    if (user.email && user.email !== existingUser.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (emailExists) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    await this.userRepository.update(id, user);
    return this.userRepository.findOneByOrFail({ id });
  }
}
