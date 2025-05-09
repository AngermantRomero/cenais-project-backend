import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiExtraModels,
} from '@nestjs/swagger';
import { MakerService } from './maker.service';
import { CreateMakerDto } from './dto/create-maker.dto';
import { UpdateMakerDto } from './dto/update-maker.dto';
import { MakerResponseDto } from './dto/maker.dto';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { MakerFiltersDto } from './dto/maker-filters.dto';
import { ApiStandardArrayResponse } from 'src/common/decorators/api-standard-array-response.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'src/roles/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('makers')
@ApiExtraModels(StandardResponseDto, MakerResponseDto)
@ApiBearerAuth('jwt')
//@UseGuards(JwtAuthGuard, RolesGuard)//
@Roles(RoleName.ADMINISTRATOR) // Ajusta los roles según necesidad
@Controller('makers')
export class MakerController {
  constructor(private readonly makerService: MakerService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los fabricantes',
    description: 'Lista todos los fabricantes con filtros opcionales.',
  })
  @ApiStandardArrayResponse(
    MakerResponseDto,
    HttpStatus.OK,
    'Operación exitosa',
  )
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async findAll(
    @Query() filters: MakerFiltersDto,
  ): Promise<MakerResponseDto[]> {
    return this.makerService.findAll(filters);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear un fabricante',
    description: 'Registra un nuevo fabricante en la base de datos.',
  })
  @ApiBody({
    type: CreateMakerDto,
    description: 'Datos para crear un fabricante',
  })
  @ApiStandardResponse(
    MakerResponseDto,
    HttpStatus.CREATED,
    'Fabricante creado exitosamente',
  )
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El fabricante ya existe')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  async create(
    @Body() createMakerDto: CreateMakerDto,
  ): Promise<MakerResponseDto> {
    return this.makerService.create(createMakerDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un fabricante por ID',
    description: 'Busca un fabricante por su identificador único (UUID).',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiStandardResponse(MakerResponseDto, HttpStatus.OK, 'Fabricante encontrado')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Fabricante no encontrado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'ID inválido')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MakerResponseDto> {
    return this.makerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un fabricante',
    description: 'Modifica los datos de un fabricante existente (parcial).',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiBody({
    type: UpdateMakerDto,
    examples: {
      'Actualizar nombre': {
        value: { name: 'Nuevo nombre' },
      },
      'Actualizar múltiples campos': {
        value: { name: 'Nombre nuevo', isActive: false },
      },
    },
  })
  @ApiStandardResponse(
    MakerResponseDto,
    HttpStatus.OK,
    'Fabricante actualizado',
  )
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Fabricante no encontrado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMakerDto: UpdateMakerDto,
  ): Promise<MakerResponseDto> {
    return this.makerService.update(id, updateMakerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un fabricante',
    description: 'Elimina permanentemente un fabricante (irreversible).',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Fabricante eliminado - Sin contenido',
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Fabricante no encontrado')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.makerService.delete(id);
  }
}
