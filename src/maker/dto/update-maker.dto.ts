import { PartialType } from '@nestjs/mapped-types';
import { CreateMakerDto } from './create-maker.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMakerDto extends PartialType(CreateMakerDto) {
  @ApiPropertyOptional({
    example: 'Toyota',
    description: 'Nombre comercial del fabricante',
    maxLength: 45,
  })
  @IsString()
  @MaxLength(45)
  brand?: string;

  @ApiPropertyOptional({
    example: 'Fabricante de vehículos japoneses',
    description: 'Descripción detallada del fabricante',
  })
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'Japón',
    description: 'Nombre del país asociado',
  })
  @ApiPropertyOptional({
    example: 'Japón',
    description: 'Nuevo nombre del país asociado',
  })
  @IsOptional()
  @IsString()
  countryName?: string;
}
