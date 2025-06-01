import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { EquipmentStateHistoryService } from './equipment-state-history.service';
import { CreateEquipmentStateHistoryDto } from './dto/create-equipment-state-history.dto';
import { FilterEquipmentStateHistoryDto } from './dto/filter-equipment-state-history.dto';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';

@ApiTags('Equipment State History')
//@ApiBearerAuth()
@Controller('equipment-state-history')
export class EquipmentStateHistoryController {
  constructor(private readonly historyService: EquipmentStateHistoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo registro de historial de estado de equipo',
    description: 'Registra un cambio de estado para un equipo específico',
  })
  @ApiBody({ type: CreateEquipmentStateHistoryDto })
  @ApiCreatedResponse({
    description: 'Historial creado exitosamente',
    type: EquipmentStateHistory,
  })
  @ApiBadRequestResponse({
    description: 'Datos inválidos o IDs incorrectos',
  })
  @ApiNotFoundResponse({
    description: 'Equipo o estado no encontrado',
  })
  async create(@Body() createDto: CreateEquipmentStateHistoryDto) {
    return this.historyService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Filtrar historial de estados de equipos',
    description:
      'Obtiene el historial de estados filtrado por equipo y/o rango de fechas',
  })
  @ApiQuery({ name: 'equipmentId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiOkResponse({
    description: 'Lista de registros de historial encontrados',
    type: [EquipmentStateHistory],
  })
  @ApiBadRequestResponse({
    description: 'Parámetros de filtrado inválidos',
  })
  async filter(@Query() query: FilterEquipmentStateHistoryDto) {
    return this.historyService.filter(query);
  }
}
