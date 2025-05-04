import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpStatus,
  ParseUUIDPipe,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RoleDto } from './dto/role.dto';
import { ApiStandardArrayResponse } from 'src/common/decorators/api-standard-array-response.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { RoleName } from './enums/roles.enum';

@ApiTags('roles')
@ApiExtraModels(StandardResponseDto, RoleDto)
/* @ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMINISTRATOR) */
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los roles' })
  @ApiStandardArrayResponse(RoleDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener rol por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiStandardResponse(RoleDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  @ApiResponse({ status: HttpStatus.OK, description: 'Rol encontrado' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo role' })
  @ApiStandardResponse(RoleDto, HttpStatus.CREATED, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El role ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar role por ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiBody({
    type: UpdateRoleDto,
    examples: {
      'Actualizar nombre': {
        value: {
          name: 'Nuevo nombre',
        },
      },
    },
  })
  @ApiStandardResponse(RoleDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Role no encontrado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El role ya existe')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar role por ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Role eliminado' })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del role en formato UUIDv4',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Role eliminado exitosamente - No devuelve contenido',
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Usuario no encontrado')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
