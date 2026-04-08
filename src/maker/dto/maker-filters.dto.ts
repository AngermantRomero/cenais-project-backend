import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class MakerFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por marca (búsqueda parcial)',
    example: 'Toyota',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ID de país', example: 1 })
  @IsOptional()
  @IsUUID()
  countryId?: string;
}
