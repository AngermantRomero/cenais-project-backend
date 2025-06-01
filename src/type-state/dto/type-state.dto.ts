import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, Length } from 'class-validator';

export class CreateTypeStateDto {
  @ApiProperty({
    description: 'Nombre único del tipo de estado',
    example: 'En mantenimiento',
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  name: string;

  @ApiProperty({
    description: 'Descripción opcional del tipo de estado',
    example: 'Equipo en proceso de reparación',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateTypeStateDto {
  @ApiProperty({
    description: 'Nombre actualizado del tipo de estado',
    example: 'En revisión técnica',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @ApiProperty({
    description: 'Descripción actualizada',
    example: 'Equipo en evaluación de funcionamiento',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
