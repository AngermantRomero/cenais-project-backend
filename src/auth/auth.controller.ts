import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';

@ApiTags('auth')
@ApiExtraModels(StandardResponseDto, UserDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiStandardResponse(UserDto, HttpStatus.CREATED, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El email ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiBody({ type: LoginDto })
  @ApiStandardResponse(UserDto, HttpStatus.CREATED, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'Credenciales inválidas')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
