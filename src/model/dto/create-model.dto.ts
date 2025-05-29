import {
  IsString,
  Length,
  IsUUID,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateModelDto {
  @ApiProperty({
    description: 'Nombre del modelo (entre 2 y 100 caracteres)',
    example: 'Corolla',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @Length(2, 100, {
    message: 'El nombre del modelo debe tener entre 2 y 100 caracteres',
  })
  @IsNotEmpty({ message: 'El nombre del modelo no puede estar vacío' })
  modelName: string;

  @ApiPropertyOptional({
    description: 'Descripción del modelo (hasta 500 caracteres)',
    example: 'Sedán compacto con eficiencia de combustible',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @Length(0, 500, {
    message: 'La descripción no puede exceder los 500 caracteres',
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'ID del fabricante (formato UUID)',
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'El ID del fabricante es requerido' })
  makerId: string;
}
