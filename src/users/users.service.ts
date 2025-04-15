import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: CreateUserDto) {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }
  async getUsers() {
    return await this.userRepository.find();
  }
  async getUser(id: string) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
  async deleteUser(id: string) {
    return await this.userRepository.delete({ id });
  }
  async updateUser(id: string, user: UpdateUserDto) {
    return await this.userRepository.update({ id }, user);
  }
}
