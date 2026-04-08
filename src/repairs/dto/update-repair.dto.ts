import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsDateString,
  IsIn,
  IsString,
  MaxLength,
} from 'class-validator';
import { CreateReparationDto } from './create-repair.dto';

export class UpdateReparationDto extends PartialType(CreateReparationDto) {
  @ApiProperty({
    description: 'Fecha de finalización de la reparación',
    example: '2026-03-15',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Formato de fecha inválido. Use YYYY-MM-DD' })
  endDate?: Date;

  @ApiProperty({
    description: 'Estado actual de la reparación',
    example: 'completed',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    enumName: 'ReparationStatus',
    required: false,
    type: String,
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'], {
    message:
      'Estado no válido. Valores permitidos: pending, in_progress, completed, cancelled',
  })
  status?: string;

  @ApiProperty({
    description: 'Observaciones adicionales sobre la reparación',
    example: 'Reparación completada exitosamente. Pruebas realizadas.',
    required: false,
    nullable: true,
    type: String,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  @MaxLength(1000, {
    message: 'Las observaciones no pueden exceder 1000 caracteres',
  })
  observations?: string;
}
