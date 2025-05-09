import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CountryFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre de país (búsqueda parcial)',
    example: 'Méx',
  })
  @IsOptional()
  @IsString()
  countryName?: string;
}
