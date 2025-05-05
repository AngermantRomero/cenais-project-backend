import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSitioDto } from './create-sites.dto';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateSitioDto extends PartialType(CreateSitioDto) {
  @ApiProperty({
    example: 'Avellaneda Actualizada',
    description: 'Nombre actualizado de la localidad',
    maxLength: 45,
    required: false,
    type: String,
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MaxLength(45, {
    message: 'La localidad no puede tener más de 45 caracteres',
  })
  localidad?: string;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'Nuevo UUID de provincia asociada',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Si se proporciona ID de provincia, no puede estar vacío',
  })
  @IsUUID()
  idProvincia?: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'Nuevo UUID de código asociado',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsNotEmpty({
    message: 'Si se proporciona ID de código, no puede estar vacío',
  })
  @IsUUID()
  Codigo?: number;
}
