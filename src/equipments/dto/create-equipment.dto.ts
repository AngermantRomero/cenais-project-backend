import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
} from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ example: 'SN-12345', description: 'Número de serie único' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 45)
  serialNumber: string;

  @ApiProperty({ example: 'INV-789', description: 'Número de inventario' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 45)
  inventoryNumber: string;

  @ApiProperty({ example: '2023-01-15', description: 'Fecha de inicio' })
  @IsNotEmpty()
  @IsDateString()
  startOfOperation: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del fabricante',
  })
  @IsNotEmpty()
  @IsString()
  makerId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del modelo',
  })
  @IsNotEmpty()
  @IsString()
  modelId: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del tipo de equipamiento (TypeEquipement)',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  typeEquipementId: string;
}
