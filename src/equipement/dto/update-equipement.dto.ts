import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateEquipoDto } from './create-equipement.dto';
import { IsOptional, IsString, IsDateString, Length } from 'class-validator';

export class UpdateEquipoDto extends PartialType(CreateEquipoDto) {
  @ApiProperty({
    required: false,
    example: 'SN-12345',
    description: 'Número de serie (opcional)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 45)
  serialNumber?: string;

  @ApiProperty({
    required: false,
    example: 'INV-789',
    description: 'Número de inventario (opcional)',
  })
  @IsOptional()
  @IsString()
  @Length(3, 45)
  inventoryNumber?: string;

  @ApiProperty({
    required: false,
    example: '2023-01-15',
    description: 'Fecha de inicio de operación (opcional)',
  })
  @IsOptional()
  @IsDateString()
  StartofOperation?: string;
}
