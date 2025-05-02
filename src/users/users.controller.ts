import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseUUIDPipe } from '@nestjs/common';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista completa de todos los usuarios registrados en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      example: [
        {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'Juan Pérez',
          lastName: 'González',
          email: 'juan.perez@example.com',
          phone: '+56912345678',
          roleId: 1,
          isActive: true,
          createdAt: '2023-10-25T12:00:00Z',
          updateAt: '2023-10-25T12:00:00Z',
        },
        {
          id: '4fb85f64-5717-4562-b3fc-2c963f66afa7',
          name: 'María García',
          lastName: 'López',
          email: 'maria.garcia@example.com',
          phone: '+56987654321',
          roleId: 2,
          isActive: true,
          createdAt: '2023-10-25T12:00:00Z',
          updateAt: '2023-10-25T12:00:00Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido o no proporcionado',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario creado exitosamente',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de usuario inválidos',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El email ya existe',
  })
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener usuario por ID',
    description:
      'Recupera los detalles completos de un usuario específico usando su ID ',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario encontrado exitosamente',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Usuario no encontrado',
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'ID inválido',
  })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un usuario',
    description:
      'Elimina permanentemente un usuario del sistema. Operación irreversible.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del usuario en formato UUIDv4',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Usuario eliminado exitosamente - No devuelve contenido',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message:
            'Usuario con ID 3fa85f64-5717-4562-b3fc-2c963f66afa6 no encontrado',
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'No autorizado - Token inválido o faltante',
  })
  async deleteUser(@Param('id') id: string): Promise<void> {
    const result = await this.usersService.deleteUser(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description:
      'Actualiza parcialmente los datos de un usuario existente. Campos opcionales.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del usuario en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: 'string',
  })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      'Actualizar nombre': {
        value: {
          name: 'Nuevo nombre',
        },
      },
      'Actualizar email': {
        value: {
          email: 'nuevo@email.com',
        },
      },
      'Actualizar múltiples campos': {
        value: {
          name: 'Nombre nuevo',
          phone: '+56987654321',
          isActive: false,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
    content: {
      'application/json': {
        example: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          name: 'Nombre actualizado',
          lastName: 'Pérez',
          email: 'usuario@example.com',
          phone: '+56912345678',
          roleId: 1,
          isActive: true,
          createdAt: '2023-10-25T12:00:00Z',
          updateAt: '2023-10-26T15:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          message: 'Usuario no encontrado',
          error: 'Not Found',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: [
            'email debe ser un email válido',
            'phone debe ser un número telefónico válido',
          ],
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El email ya está en uso por otro usuario',
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          message: 'El email ya está registrado',
          error: 'Conflict',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, user);
  }
}
