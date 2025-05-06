import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({
    example: 'Manicaragua',
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
  locality: string;

  @ApiProperty({
    example: 'MGV',
    description: 'Código del sitio',
    required: true,
    type: String,
  })
  @IsString({ message: 'El código debe ser una cadena de texto válida' })
  @IsNotEmpty({ message: 'El ID de código es requerido' })
  code: string;
}
