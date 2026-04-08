import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { EquipmentStateHistoryService } from './equipment-state-history.service';
import { CreateEquipmentStateHistoryDto } from './dto/create-equipment-state-history.dto';
import { FilterEquipmentStateHistoryDto } from './dto/filter-equipment-state-history.dto';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';

@ApiTags('Equipment State History')
@ApiBearerAuth()
@Controller('equipment-state-history')
export class EquipmentStateHistoryController {
  constructor(private readonly historyService: EquipmentStateHistoryService) {}

  // ==================== MÉTODOS EXISTENTES ====================

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo registro de historial de estado de equipo',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Historial creado',
    type: EquipmentStateHistory,
  })
  create(@Body() createDto: CreateEquipmentStateHistoryDto) {
    return this.historyService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Filtrar historial de estados de equipos' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de registros',
    type: [EquipmentStateHistory],
  })
  filter(@Query() query: FilterEquipmentStateHistoryDto) {
    return this.historyService.filter(query);
  }

  @Get('equipment/:equipmentId')
  @ApiOperation({ summary: 'Obtener historial por equipo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Historial del equipo',
    type: [EquipmentStateHistory],
  })
  findByEquipment(@Param('equipmentId') equipmentId: string) {
    return this.historyService.findByEquipmentId(equipmentId);
  }

  @Get('last-state/:equipmentId')
  @ApiOperation({ summary: 'Obtener último estado de un equipo' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Último estado',
    type: EquipmentStateHistory,
  })
  getLastState(@Param('equipmentId') equipmentId: string) {
    return this.historyService.getLastState(equipmentId);
  }

  // ==================== NUEVOS ENDPOINTS ====================

  @Get('latest')
  @ApiOperation({ summary: 'Obtener últimos cambios de estado globales' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Últimos cambios',
    type: [EquipmentStateHistory],
  })
  getLatestChanges(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.historyService.getLatestStateChanges(limitNumber);
  }

  @Get('time-in-states/:equipmentId')
  @ApiOperation({
    summary: 'Calcular tiempo que un equipo pasó en cada estado',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Tiempo por estado' })
  getTimeInStates(@Param('equipmentId') equipmentId: string) {
    return this.historyService.getTimeInStates(equipmentId);
  }

  @Get('by-user')
  @ApiOperation({ summary: 'Obtener estadísticas de cambios por usuario' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas por usuario',
  })
  getChangesByUser(@Query('userId') userId?: string) {
    return this.historyService.getChangesByUser(userId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de cambios por período' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Resumen de cambios' })
  getSummary(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.historyService.getChangesSummary(daysNumber);
  }

  @Get('by-state')
  @ApiOperation({ summary: 'Obtener estadísticas de cambios por estado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Estadísticas por estado',
  })
  getChangesByState() {
    return this.historyService.getChangesByState();
  }

  @Get('paginated')
  @ApiOperation({ summary: 'Obtener historial paginado' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Historial paginado' })
  getPaginatedHistory(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 20;
    return this.historyService.getPaginatedHistory(pageNumber, limitNumber);
  }
}
