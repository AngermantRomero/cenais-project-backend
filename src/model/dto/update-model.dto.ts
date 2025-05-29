import { PartialType } from '@nestjs/swagger';
import { CreateModelDto } from './create-model.dto';
import { IsOptional, IsString, Length, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @ApiPropertyOptional({
    description: 'Nuevo nombre del modelo (entre 2 y 100 caracteres)',
    example: 'Corolla Hybrid',
    minLength: 2,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  modelName?: string;

  @ApiPropertyOptional({
    description: 'Nueva descripción del modelo (hasta 500 caracteres)',
    example: 'Modelo Premium 2024 con sistema híbrido',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @ApiPropertyOptional({
    description: 'ID del fabricante asociado (formato UUID)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  makerId?: string;
}
