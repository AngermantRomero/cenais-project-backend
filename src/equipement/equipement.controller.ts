import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { EquiposService } from './equipement.service';
import { CreateEquipoDto } from './dto/create-equipement.dto';
import { UpdateEquipoDto } from './dto/update-equipement.dto';
import { Equipo } from './entities/equipement.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Equipos')
@Controller('equipos')
export class EquiposController {
  constructor(private readonly equiposService: EquiposService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nuevo equipo',
    description: 'Registra un nuevo equipo en el sistema',
  })
  @ApiBody({ type: CreateEquipoDto })
  async create(@Body() createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    return this.equiposService.create(createEquipoDto);
  }
  @ApiResponse({ status: 201, description: 'Equipo creado', type: Equipo })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Get()
  @ApiOperation({
    summary: 'Listar equipos',
    description: 'Obtiene todos los equipos registrados',
  })
  @ApiResponse({ status: 200, description: 'Lista de equipos', type: [Equipo] })
  async findAll(): Promise<Equipo[]> {
    return this.equiposService.findAll();
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
  @ApiResponse({ status: 200, description: 'Equipo encontrado', type: Equipo })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  async findOne(@Param('id') id: string): Promise<Equipo> {
    return this.equiposService.findOne(id);
  }
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar equipo',
    description: 'Actualiza los datos de un equipo existente',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEquipoDto })
  @ApiResponse({ status: 200, description: 'Equipo actualizado', type: Equipo })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateEquipoDto: UpdateEquipoDto,
  ): Promise<Equipo> {
    return this.equiposService.update(id, updateEquipoDto);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 (sin contenido)
  @ApiOperation({
    summary: 'Eliminar equipo',
    description: 'Elimina un equipo por su ID',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Equipo eliminado' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.equiposService.remove(id);
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
    type: [Equipo],
  })
  async findByDate(@Param('date') date: string): Promise<Equipo[]> {
    return this.equiposService.findByDate(date);
  }
}
