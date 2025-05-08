import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiExtraModels,
  ApiResponse,
} from '@nestjs/swagger';
import { ParseUUIDPipe } from '@nestjs/common';
import { ApiStandardArrayResponse } from 'src/common/decorators/api-standard-array-response.decorator';
import { ApiErrorResponse } from 'src/common/decorators/api-error-response.decorator';
import { ApiStandardResponse } from 'src/common/decorators/api-standard-response.decorator';
import { StandardResponseDto } from 'src/common/dto/response.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleName } from 'src/roles/enums/roles.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Query } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesDto } from './dto/site.dto';
import { Sites } from './entities/sites.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSitesDto } from './dto/update-site.dto';

@ApiTags('sites')
@ApiExtraModels(StandardResponseDto, SitesDto)
/* @ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleName.ADMINISTRATOR) */
@Controller('sites')
export class SitesController {
  constructor(private sitesService: SitesService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los sitios',
    description:
      'Retorna una lista completa de todos los sitios registrados en el sistema. Se pueden filtrar los resultados por nombre, apellido, role y estado activo.',
  })
  @ApiStandardArrayResponse(SitesDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async getSites(): Promise<Sites[]> {
    return this.sitesService.getSites();
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo sitio' })
  @ApiBody({ type: CreateSiteDto })
  @ApiStandardResponse(SitesDto, HttpStatus.CREATED, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El sitio ya existe')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async createSite(@Body() newSite: CreateSiteDto) {
    return this.sitesService.createSite(newSite);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener sitio por ID',
    description:
      'Recupera los detalles completos de un sitio específico usando su Id ',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiStandardResponse(SitesDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async getSite(@Param('id', ParseUUIDPipe) id: string): Promise<Sites> {
    return this.sitesService.getSite(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un sitio',
    description:
      'Actualiza parcialmente los datos de un sitio existente. Campos opcionales.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID del sitio a actualizar en formato UUID',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    type: 'string',
  })
  @ApiBody({
    type: UpdateSitesDto,
    examples: {
      'Actualizar localidad': {
        value: {
          locality: 'Nuevo nombre',
        },
      },
      'Actualizar code': {
        value: {
          code: 'Nuevo código',
        },
      },
      'Actualizar múltiples campos': {
        value: {
          localidad: 'Nombre nuevo',
          code: 'Nuevo código',
        },
      },
    },
  })
  @ApiStandardResponse(SitesDto, HttpStatus.OK, 'Operación exitosa')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Sitio no encontrado')
  @ApiErrorResponse(HttpStatus.CONFLICT, 'El sitio ya existe')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async updateSite(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() site: UpdateSitesDto,
  ): Promise<Sites> {
    return this.sitesService.updateSite(id, site);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un sitio',
    description:
      'Elimina permanentemente un sitio del sistema. Operación irreversible.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del sitio en formato UUIDv4',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sitio eliminado exitosamente - No devuelve contenido',
  })
  @ApiErrorResponse(HttpStatus.NOT_FOUND, 'Sitio no encontrado')
  @ApiErrorResponse(HttpStatus.UNAUTHORIZED, 'No autorizado')
  @ApiErrorResponse(HttpStatus.BAD_REQUEST, 'Datos inválidos')
  @ApiErrorResponse(
    HttpStatus.INTERNAL_SERVER_ERROR,
    'Error interno del servidor',
  )
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    await this.sitesService.deleteSite(id);
    return null;
  }
}
