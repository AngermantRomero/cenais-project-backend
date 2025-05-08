import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { MakerService } from './maker.service';
import { CreateMakerDto } from './dto/create-maker.dto';
import { UpdateMakerDto } from './dto/update-maker.dto';
import { MakerResponseDto } from './dto/maker.dto';

@ApiTags('makers') // Agrupa los endpoints bajo la etiqueta "makers" en Swagger
@Controller('makers')
export class MakerController {
  constructor(private readonly makerService: MakerService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un fabricante',
    description: 'Registra un nuevo fabricante en la base de datos.',
  })
  @ApiResponse({
    status: 201,
    description: 'Fabricante creado exitosamente.',
    type: MakerResponseDto,
  })
  @ApiBody({
    type: CreateMakerDto,
    description: 'Datos para crear un fabricante',
  })
  async create(
    @Body() createMakerDto: CreateMakerDto,
  ): Promise<MakerResponseDto> {
    return this.makerService.create(createMakerDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los fabricantes',
    description: 'Lista todos los fabricantes disponibles en la base de datos.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de fabricantes obtenida correctamente.',
    type: [MakerResponseDto],
  })
  async findAll(): Promise<MakerResponseDto[]> {
    return this.makerService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un fabricante por ID',
    description: 'Busca un fabricante por su identificador único.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID del fabricante' })
  @ApiResponse({
    status: 200,
    description: 'Fabricante encontrado.',
    type: MakerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Fabricante no encontrado.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MakerResponseDto> {
    return this.makerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un fabricante',
    description: 'Modifica los datos de un fabricante existente.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID del fabricante' })
  @ApiBody({
    type: UpdateMakerDto,
    description: 'Datos para actualizar el fabricante',
  })
  @ApiResponse({
    status: 200,
    description: 'Fabricante actualizado.',
    type: MakerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Error al actualizar el fabricante.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMakerDto: UpdateMakerDto,
  ): Promise<MakerResponseDto> {
    return this.makerService.update(id, updateMakerDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un fabricante',
    description: 'Elimina un fabricante de la base de datos.',
  })
  @ApiParam({ name: 'id', type: 'string', description: 'UUID del fabricante' })
  @ApiResponse({
    status: 204,
    description: 'Fabricante eliminado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Fabricante no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.makerService.delete(id);
  }
}
