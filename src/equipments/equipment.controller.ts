import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { EquipmentsService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './entities/equipment.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExtraModels,
} from '@nestjs/swagger';
import { EquipmentDto } from './dto/equipment.dto';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiStandardArrayResponse } from 'src/common/decorators/api-standard-array-response.decorator';
import { StandardResponseDto } from 'src/common/dto/response.dto';

@ApiTags('equipments')
@ApiExtraModels(StandardResponseDto, EquipmentDto)
@Controller('equipments')
export class EquipmentsController {
  constructor(private readonly equipmentsService: EquipmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo equipo',
    description: 'Registra un nuevo equipo en el sistema',
  })
  @ApiBody({ type: CreateEquipmentDto })
  @ApiStandardResponse(
    EquipmentDto,
    HttpStatus.CREATED,
    'Usuario creado correctamente',
  )
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El equipo ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async create(
    @Body() createEquipmentDto: CreateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentsService.create(createEquipmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar equipos',
    description: 'Obtiene todos los equipos registrados',
  })
  @ApiStandardArrayResponse(EquipmentDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async findAll(): Promise<Equipment[]> {
    return this.equipmentsService.findAll();
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener equipo por ID',
    description: 'Busca un equipo específico por su UUID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiStandardResponse(EquipmentDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async findOne(@Param('id') id: string): Promise<Equipment> {
    return this.equipmentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar equipo',
    description: 'Actualiza los datos de un equipo existente',
  })
  @ApiParam({
    name: 'id',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único del equipo en formato UUIDv4',
  })
  @ApiBody({
    type: UpdateEquipmentDto,
    examples: {
      'Actualizar numero de serie': {
        value: {
          serialNumber: 'SN-12345',
        },
      },
      'Actualizar numero de inventario': {
        value: {
          inventoryNumber: 'INV-789',
        },
      },
      'Actualizar múltiples campos': {
        value: {
          serialNumber: 'SN-12345',
          inventoryNumber: 'INV-789',
          startOfOperation: '2023-01-15',
        },
      },
    },
  })
  @ApiStandardResponse(EquipmentDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Equipo no encontrado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El equipo ya existe')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async update(
    @Param('id') id: string,
    @Body() updateEquipmentDto: UpdateEquipmentDto,
  ): Promise<Equipment> {
    return this.equipmentsService.update(id, updateEquipmentDto);
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
    description: 'ID único del equipo en formato UUIDv4',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Equipo eliminado exitosamente - No devuelve contenido',
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Equipo no encontrado')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async remove(@Param('id') id: string) {
    await this.equipmentsService.remove(id);
    return null;
  }

  @Get('by-date/:date')
  @ApiOperation({
    summary: 'Equipos por fecha',
    description: 'Busca equipos por fecha de operación',
  })
  @ApiParam({ name: 'date', type: String, example: '2023-01-15' })
  @ApiResponse({
    status: 200,
    description: 'Equipos encontrados',
    type: [Equipment],
  })
  async findByDate(@Param('date') date: string): Promise<Equipment[]> {
    return this.equipmentsService.findByDate(date);
  }
}
