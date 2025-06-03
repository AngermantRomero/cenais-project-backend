import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TypeEquipementService } from './type-equipement.service';
import { CreateTypeEquipementDto } from './dto/create-typeEquipement.dto';
import { UpdateTypeEquipementDto } from './dto/update-typeEquipement.dto';
import { TypeEquipementFilterDto } from './dto/type-equipement-filter.dto';
import { TypeEquipement } from './entities/type-equipement.entity';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { UUID } from 'crypto';

@ApiTags('type-equipement') // Agrupa todos los endpoints bajo este tag en Swagger UI
@Controller('type-equipement')
export class TypeEquipementController {
  constructor(private readonly typeEquipementService: TypeEquipementService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tipo de equipamiento' })
  @ApiCreatedResponse({
    description: 'Tipo de equipamiento creado exitosamente',
    type: TypeEquipement,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiBody({ type: CreateTypeEquipementDto })
  async create(
    @Body() createTypeEquipementDto: CreateTypeEquipementDto,
  ): Promise<TypeEquipement> {
    return this.typeEquipementService.create(createTypeEquipementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los tipos de equipamiento' })
  @ApiOkResponse({
    description: 'Lista de tipos de equipamiento',
    type: [TypeEquipement],
  })
  @ApiQuery({
    name: 'filters',
    type: TypeEquipementFilterDto,
    required: false,
    description: 'Filtros para buscar tipos de equipamiento',
  })
  async findAll(
    @Query() filters: TypeEquipementFilterDto = {},
  ): Promise<TypeEquipement[]> {
    if (Object.keys(filters).length > 0) {
      return this.typeEquipementService.filter(filters);
    }
    return this.typeEquipementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tipo de equipamiento por ID' })
  @ApiOkResponse({
    description: 'Tipo de equipamiento encontrado',
    type: TypeEquipement,
  })
  @ApiNotFoundResponse({ description: 'Tipo de equipamiento no encontrado' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del tipo de equipamiento',
  })
  async findOne(@Param('id') id: UUID): Promise<TypeEquipement> {
    return this.typeEquipementService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un tipo de equipamiento' })
  @ApiOkResponse({
    description: 'Tipo de equipamiento actualizado',
    type: TypeEquipement,
  })
  @ApiNotFoundResponse({ description: 'Tipo de equipamiento no encontrado' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del tipo de equipamiento',
  })
  @ApiBody({ type: UpdateTypeEquipementDto })
  async update(
    @Param('id') id: UUID,
    @Body() updateTypeEquipementDto: UpdateTypeEquipementDto,
  ): Promise<TypeEquipement> {
    return this.typeEquipementService.update(id, updateTypeEquipementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tipo de equipamiento' })
  @ApiOkResponse({ description: 'Tipo de equipamiento eliminado' })
  @ApiNotFoundResponse({ description: 'Tipo de equipamiento no encontrado' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del tipo de equipamiento',
  })
  async remove(@Param('id') id: UUID): Promise<void> {
    return this.typeEquipementService.remove(id);
  }
}
