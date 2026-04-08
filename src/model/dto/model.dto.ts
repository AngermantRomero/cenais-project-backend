import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, Length } from 'class-validator';

export class ModelDto {
  @ApiProperty({
    description: 'ID único del modelo (UUID)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Nombre del modelo',
    example: 'Corolla Hybrid',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100)
  modelName: string;

  @ApiPropertyOptional({
    description: 'Descripción del modelo',
    example: 'Modelo Premium 2024 con sistema híbrido',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID del fabricante (UUID)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  makerId?: string;

  @ApiPropertyOptional({
    description: 'Marca del fabricante',
    example: 'Toyota',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  makerBrand?: string;
}
