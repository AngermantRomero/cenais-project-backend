import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, MaxLength } from 'class-validator';

export class CreateSitioDto {
  @ApiProperty({
    example: 'Avellaneda',
    description: 'Nombre de la localidad del sitio',
    maxLength: 45,
    required: true,
    type: String,
  })
  @IsString({ message: 'La localidad debe ser una cadena de texto válida' })
  @IsNotEmpty({ message: 'El campo localidad no puede estar vacío' })
  @MaxLength(45, {
    message: 'La localidad no puede tener más de 45 caracteres',
  })
  localidad: string;

  @ApiProperty({
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    description: 'UUID de la provincia asociada al sitio',
    required: true,
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'El ID de provincia es requerido' })
  idProvincia: number;

  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'UUID del código asociado al sitio',
    required: true,
    type: String,
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty({ message: 'El ID de código es requerido' })
  Codigo: number;
}
