import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsOptional,
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
  @IsUUID('4', { message: 'makerId debe ser un UUID válido' })
  makerId: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del modelo',
  })
  @IsNotEmpty()
  @IsUUID('4', { message: 'modelId debe ser un UUID válido' })
  modelId: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del tipo de equipamiento (TypeEquipement)',
  })
  @IsNotEmpty()
  @IsString()
  @IsUUID('4', { message: 'typeEquipementId debe ser un UUID válido' })
  typeEquipementId: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del estado inicial (UUID) - Ej: "Activo"',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID('4', { message: 'initialStateId debe ser un UUID válido' })
  initialStateId: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del sitio donde está ubicado el equipo',
    required: true,
  })
  @IsUUID('4', { message: 'siteId debe ser un UUID válido' })
  siteId?: string;

  @ApiProperty({
    example: 'admin@example.com',
    description: 'Usuario que realiza la creación',
    required: false,
    default: 'system',
  })
  @IsOptional()
  @IsString()
  changedBy?: string;
}
