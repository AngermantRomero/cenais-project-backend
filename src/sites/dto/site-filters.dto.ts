import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SiteFilterDto {
  @ApiPropertyOptional({
    example: 'Manicaragua',
    description: 'Filtrar por nombre de localidad',
  })
  @IsOptional()
  @IsString()
  locality?: string;

  @ApiPropertyOptional({
    example: 'MGV',
    description: 'Filtrar por código del sitio',
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Filtrar por ID de provincia (UUID)',
  })
  @IsOptional()
  @IsString()
  provinceId?: string;
}
