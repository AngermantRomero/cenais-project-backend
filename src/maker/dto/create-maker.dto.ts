import { IsString, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMakerDto {
  @ApiPropertyOptional({
    example: 'Toyota',
    description: 'Nombre comercial del fabricante',
    maxLength: 45,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(45)
  brand: string;

  @ApiPropertyOptional({
    example: 'Fabricante de vehículos japoneses',
    description: 'Descripción detallada del fabricante',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    example: 'Japón',
    description: 'Nombre del país asociado',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  countryName: string;
}
