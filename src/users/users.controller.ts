import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiStandardArrayResponse } from 'src/common/decorators/api-standard-array-response.decorator';
import { UserDto } from './dto/user.dto';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'src/roles/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiExtraModels(StandardResponseDto, UserDto)
/* @ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMINISTRATOR) */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description:
      'Retorna una lista completa de todos los usuarios registrados en el sistema',
  })
  @ApiStandardArrayResponse(UserDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiStandardResponse(
    UserDto,
    HttpStatus.CREATED,
    'Usuario creado correctamente',
  )
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El email ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
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
  @ApiStandardResponse(UserDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.getUser(id);
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
  @ApiStandardResponse(UserDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Usuario no encontrado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El email ya existe')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, user);
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
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Usuario no encontrado')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.deleteUser(id);
    return null;
  }
}
