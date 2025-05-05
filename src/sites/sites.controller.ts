import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { SitiosService } from './sites.service';
import { CreateSitioDto } from './dto/create-sites.dto';
import { UpdateSitioDto } from './dto/update-sites.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
@ApiTags('Sitios')
@Controller('sitios')
export class SitiosController {
  constructor(private readonly sitiosService: SitiosService) {}
  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo sitio',
    description: 'Registra un nuevo sitio en el sistema',
  })
  @ApiCreatedResponse({
    description: 'Sitio creado exitosamente',
    type: CreateSitioDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiBody({ type: CreateSitioDto })
  create(@Body() createSitioDto: CreateSitioDto) {
    return this.sitiosService.create(createSitioDto);
  }
  @Get()
  @ApiOperation({
    summary: 'Obtener todos los sitios',
    description: 'Retorna una lista completa de sitios registrados',
  })
  @ApiOkResponse({
    description: 'Lista de sitios obtenida exitosamente',
    type: [CreateSitioDto],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  findAll() {
    return this.sitiosService.findAll();
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un sitio específico',
    description: 'Recupera los detalles de un sitio por su ID',
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID del sitio' })
  @ApiOkResponse({
    description: 'Sitio encontrado',
    type: CreateSitioDto,
  })
  @ApiNotFoundResponse({ description: 'Sitio no encontrado' })
  async findOne(@Param('id') id: string) {
    const sitio = await this.sitiosService.findOne(+id);
    if (!sitio) {
      throw new NotFoundException('Sitio no encontrado');
    }
    return sitio;
  }
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un sitio',
    description: 'Actualiza los datos de un sitio existente',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del sitio a actualizar',
  })
  @ApiBody({ type: UpdateSitioDto })
  @ApiOkResponse({
    description: 'Sitio actualizado exitosamente',
    type: UpdateSitioDto,
  })
  @ApiNotFoundResponse({ description: 'Sitio no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  update(@Param('id') id: string, @Body() updateSitioDto: UpdateSitioDto) {
    return this.sitiosService.update(+id, updateSitioDto);
  }
  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un sitio',
    description: 'Elimina permanentemente un sitio del sistema',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del sitio a eliminar',
  })
  @ApiOkResponse({ description: 'Sitio eliminado exitosamente' })
  @ApiNotFoundResponse({ description: 'Sitio no encontrado' })
  remove(@Param('id') id: string) {
    return this.sitiosService.remove(+id);
  }
}
