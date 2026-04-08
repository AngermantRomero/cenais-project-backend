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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryDto } from './dto/country.dto';

@ApiTags('countries')
@Controller('countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un país',
    description: 'Crea un nuevo registro de país en la base de datos',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'País creado exitosamente',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  async create(
    @Body() createCountryDto: CreateCountryDto,
  ): Promise<CountryDto> {
    return this.countryService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los países',
    description: 'Devuelve una lista completa de países registrados',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de países obtenida correctamente',
    type: [CountryDto],
  })
  async findAll(): Promise<CountryDto[]> {
    return this.countryService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener país por ID',
    description: 'Recupera los detalles de un país específico usando su ID',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del país',
    example: '1a2b3c4d-1234-5678-9012-abcdef123456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'País encontrado',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'País no encontrado',
  })
  async findOne(@Param('id') id: string): Promise<CountryDto> {
    return this.countryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar país',
    description: 'Actualiza parcialmente los datos de un país existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del país a actualizar',
    example: '1a2b3c4d-1234-5678-9012-abcdef123456',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'País actualizado exitosamente',
    type: CountryDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'País no encontrado',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCountryDto: UpdateCountryDto,
  ): Promise<CountryDto> {
    return this.countryService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar país',
    description: 'Elimina permanentemente un país del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del país a eliminar',
    example: '1a2b3c4d-1234-5678-9012-abcdef123456',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'País eliminado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'País no encontrado',
  })
  async delete(@Param('id') id: string): Promise<void> {
    await this.countryService.delete(id);
  }
}
