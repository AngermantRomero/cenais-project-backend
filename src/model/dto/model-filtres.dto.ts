import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class ModelFiltersDto {
  @ApiPropertyOptional({
    description: 'Filtrar por nombre del modelo',
    example: 'Corolla',
  })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por descripción ',
    example: 'Sedán',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por ID de fabricante',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  makerId?: string;
}
