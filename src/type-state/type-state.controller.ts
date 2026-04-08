import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TypeStateService } from './type-state.service';
import { CreateTypeStateDto, UpdateTypeStateDto } from './dto/type-state.dto';
import { TypeState } from './entities/type-state.entity';

@ApiTags('TypeStates') // Agrupa endpoints en Swagger UI
@Controller('type-states')
export class TypeStateController {
  constructor(private readonly typeStateService: TypeStateService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de estado' })
  @ApiResponse({
    status: 201,
    description: 'Tipo de estado creado',
    type: TypeState,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDto: CreateTypeStateDto): Promise<TypeState> {
    return this.typeStateService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de estado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tipos de estado',
    type: [TypeState],
  })
  findAll(): Promise<TypeState[]> {
    return this.typeStateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de estado por ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID del tipo de estado',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  })
  @ApiResponse({
    status: 200,
    description: 'Tipo de estado encontrado',
    type: TypeState,
  })
  @ApiResponse({ status: 404, description: 'Tipo de estado no encontrado' })
  findOne(@Param('id') id: string): Promise<TypeState> {
    return this.typeStateService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de estado' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de estado a actualizar' })
  @ApiResponse({
    status: 200,
    description: 'Tipo de estado actualizado',
    type: TypeState,
  })
  @ApiResponse({ status: 404, description: 'Tipo de estado no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTypeStateDto,
  ): Promise<TypeState> {
    return this.typeStateService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de estado' })
  @ApiParam({ name: 'id', description: 'UUID del tipo de estado a eliminar' })
  @ApiResponse({ status: 204, description: 'Tipo de estado eliminado' })
  @ApiResponse({ status: 404, description: 'Tipo de estado no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.typeStateService.remove(id);
  }
}
