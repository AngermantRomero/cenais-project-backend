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
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';

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
  @Get('site/:siteId')
  @ApiOperation({
    summary: 'Equipos por sitio',
    description: 'Obtiene todos los equipos ubicados en un sitio específico',
  })
  @ApiParam({ name: 'siteId', type: String })
  @ApiStandardArrayResponse(EquipmentDto, HttpStatus.OK, 'Equipos encontrados')
  async findBySite(@Param('siteId') siteId: string): Promise<Equipment[]> {
    return this.equipmentsService.findBySite(siteId);
  }
  @Get('serial/:serialNumber')
  @ApiOperation({
    summary: 'Buscar equipo por número de serie',
    description: 'Obtiene un equipo por su número de serie único',
  })
  @ApiParam({ name: 'serialNumber', type: String })
  @ApiStandardResponse(EquipmentDto, HttpStatus.OK, 'Equipo encontrado')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Equipo no encontrado')
  async findBySerialNumber(
    @Param('serialNumber') serialNumber: string,
  ): Promise<Equipment> {
    return this.equipmentsService.findBySerialNumber(serialNumber);
  }
  @Get('state/:stateId')
  @ApiOperation({
    summary: 'Equipos por estado actual',
    description: 'Obtiene todos los equipos con un estado específico',
  })
  @ApiParam({ name: 'stateId', type: String })
  @ApiStandardArrayResponse(EquipmentDto, HttpStatus.OK, 'Equipos encontrados')
  async findByCurrentState(
    @Param('stateId') stateId: string,
  ): Promise<Equipment[]> {
    return this.equipmentsService.findByCurrentState(stateId);
  }
  @Get(':id/state-history')
  @ApiOperation({
    summary: 'Obtener historial de estados',
    description: 'Obtiene el historial completo de estados de un equipo',
  })
  @ApiStandardArrayResponse(
    EquipmentStateHistory,
    HttpStatus.OK,
    'Operación exitosa',
  )
  async getStateHistory(
    @Param('id') id: string,
  ): Promise<EquipmentStateHistory[]> {
    return this.equipmentsService.getStateHistory(id);
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
  @Patch(':id/state')
  @ApiOperation({
    summary: 'Cambiar estado del equipo',
    description:
      'Actualiza el estado actual del equipo y registra en historial',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        stateId: {
          type: 'string',
          format: 'uuid',
          example: '550e8400-e29b-41d4-a716-446655440000',
        },
        changedBy: {
          type: 'string',
          example: 'admin@example.com',
          default: 'system',
        },
      },
    },
  })
  @ApiStandardResponse(EquipmentDto, HttpStatus.OK, 'Estado actualizado')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Equipo o estado no encontrado')
  async changeState(
    @Param('id') id: string,
    @Body('stateId') stateId: string,
    @Body('changedBy') changedBy?: string,
  ): Promise<Equipment> {
    return this.equipmentsService.changeEquipmentState(
      id,
      stateId,
      changedBy || 'system',
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar equipo',
    description:
      'Elimina permanentemente un usuario del sistema. Operación irreversible.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
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
}
