import { IsOptional, IsString, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UserFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre (parcial)',
    example: 'juan',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por Apellido (parcial)',
    example: 'Perez',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por rol (nombre)',
    example: 'ADMINISTRATOR',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por estado activo',
    example: 'true',
  })
  @IsOptional()
  @IsBooleanString()
  isActive?: string;
}
