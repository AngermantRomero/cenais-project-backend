import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { updateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }
  @Get(':id')
  async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
    const user = await this.usersService.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    user: updateUserDto,
  ) {
    return this.usersService.updateUser(id, user);
  }
}
