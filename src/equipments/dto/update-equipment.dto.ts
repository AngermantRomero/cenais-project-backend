import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsBoolean,
} from 'class-validator';

export class UpdateEquipmentDto {
  @ApiProperty({ example: 'SN-12345', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 45)
  serialNumber?: string;

  @ApiProperty({ example: 'INV-789', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 45)
  inventoryNumber?: string;

  @ApiProperty({ example: '2023-01-15', required: false })
  @IsOptional()
  @IsDateString()
  startOfOperation?: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'makerId debe ser un UUID válido' })
  makerId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'modelId debe ser un UUID válido' })
  modelId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'typeEquipementId debe ser un UUID válido' })
  typeEquipementId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    description: 'ID del nuevo estado del equipo',
  })
  @IsOptional()
  @IsUUID('4', { message: 'currentStateId debe ser un UUID válido' })
  currentStateId?: string;

  // 👇 CAMPOS NUEVOS QUE FALTABAN
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    description: 'ID del sitio donde está ubicado el equipo',
  })
  @IsOptional()
  @IsUUID('4', { message: 'siteId debe ser un UUID válido' })
  siteId?: string;

  @ApiProperty({
    example: true,
    required: false,
    description: 'Permite eliminar la ubicación del equipo',
  })
  @IsOptional()
  @IsBoolean()
  removeSite?: boolean;

  @ApiProperty({
    example: 'admin@example.com',
    required: false,
    description: 'Usuario que realiza la actualización',
    default: 'system',
  })
  @IsOptional()
  @IsString()
  changedBy?: string;
}
