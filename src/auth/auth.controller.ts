import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleName } from 'src/roles/enums/roles.enum';
import { ActivateAccountDto } from './dto/activate-account.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@ApiTags('auth')
@ApiExtraModels(StandardResponseDto, UserDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /* @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleName.ADMINISTRATOR) */
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
  @ApiStandardResponse(UserDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'Credenciales inválidas')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Activar cuenta y establecer contraseña' })
  @ApiBody({ type: ActivateAccountDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Se ha enviado un correo de recuperación de contraseña.',
  })
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El email ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async activate(@Body() dto: ActivateAccountDto) {
    return this.authService.activateAccount(dto.token, dto.password);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Enviar correo de recuperación de contraseña',
    description:
      'Envía un correo a un usuario con un enlace para restablecer su contraseña.',
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Se ha enviado un correo de recuperación de contraseña.',
  })
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.authService.resetPassword(dto);
    return null;
  }
}
