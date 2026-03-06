import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RepairsService } from './repairs.service';
import { CreateReparationDto } from './dto/create-repair.dto';
import { UpdateReparationDto } from './dto/update-repair.dto';
import { FilterReparationDto } from './dto/filter-repair-dto';
import { Repair } from './entities/repair.entity';

@ApiTags('Repairs')
@ApiBearerAuth()
@Controller('repairs')
export class RepairsController {
  constructor(private readonly reparationService: RepairsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva reparación' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reparación creada',
    type: Repair,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Equipo o técnico no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  create(@Body() createDto: CreateReparationDto) {
    return this.reparationService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las reparaciones con filtros' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de reparaciones',
    type: [Repair],
  })
  findAll(@Query() query: FilterReparationDto) {
    return this.reparationService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una reparación por ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reparación encontrada',
    type: Repair,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reparación no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.reparationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una reparación' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reparación actualizada',
    type: Repair,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reparación o técnico no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateReparationDto) {
    return this.reparationService.update(id, updateDto);
  }

  @Patch(':id/completar')
  @ApiOperation({ summary: 'Completar una reparación' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reparación completada',
    type: Repair,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reparación no encontrada',
  })
  completar(
    @Param('id') id: string,
    @Body('observaciones') observaciones?: string,
  ) {
    return this.reparationService.completeRepair(id, observaciones);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una reparación' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reparación eliminada' })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Reparación no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.reparationService.remove(id);
  }
}
