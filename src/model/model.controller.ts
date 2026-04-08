import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelDto } from './dto/model.dto';
import { ModelFiltersDto } from './dto/model-filtres.dto';

@ApiTags('models')
@Controller('models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un modelo',
    description: 'Registra un nuevo modelo asociado a un fabricante',
  })
  @ApiBody({ type: CreateModelDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Modelo creado',
    type: ModelDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Fabricante no encontrado',
  })
  async create(@Body() createModelDto: CreateModelDto): Promise<ModelDto> {
    return this.modelService.create(createModelDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los modelos',
    description: 'Lista todos los modelos con filtros opcionales',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de modelos',
    type: [ModelDto],
  })
  async findAll(@Query() filters?: ModelFiltersDto): Promise<ModelDto[]> {
    return this.modelService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener modelo por ID',
    description: 'Recupera un modelo específico por su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del modelo en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Modelo encontrado',
    type: ModelDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Modelo no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<ModelDto> {
    return this.modelService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar modelo',
    description: 'Actualiza parcialmente un modelo existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del modelo en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: String,
  })
  @ApiBody({ type: UpdateModelDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Modelo actualizado',
    type: ModelDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Modelo no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<ModelDto> {
    return this.modelService.update(id, updateModelDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar modelo',
    description: 'Elimina permanentemente un modelo',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del modelo en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Modelo eliminado',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Modelo no encontrado',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.modelService.delete(id);
  }
}
