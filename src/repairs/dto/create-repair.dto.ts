import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateReparationDto {
  @ApiProperty({
    description: 'Fecha de inicio de la reparación',
    example: '2026-03-02',
    type: String,
    format: 'date',
    required: true,
  })
  @IsNotEmpty({ message: 'La fecha de inicio es obligatoria' })
  @IsDateString({}, { message: 'Formato de fecha inválido. Use YYYY-MM-DD' })
  startDate: Date;

  @ApiProperty({
    description: 'Fecha de finalización de la reparación (opcional)',
    example: '2026-03-10',
    type: String,
    format: 'date',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString({}, { message: 'Formato de fecha inválido. Use YYYY-MM-DD' })
  endDate?: Date;

  @ApiProperty({
    description: 'Descripción detallada de la reparación realizada',
    example: 'Reparación de sensor sísmico - cambio de componente dañado',
    minLength: 5,
    maxLength: 500,
    type: String,
    required: true,
  })
  @IsNotEmpty({ message: 'La descripción es obligatoria' })
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(5, { message: 'La descripción debe tener al menos 5 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  description: string;

  @ApiProperty({
    description: 'ID del equipo que se está reparando (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    required: true,
  })
  @IsNotEmpty({ message: 'El ID del equipo es obligatorio' })
  @IsUUID('4', { message: 'ID de equipo inválido. Debe ser un UUID válido' })
  equipmentId: string;

  @ApiProperty({
    description: 'ID del técnico asignado a la reparación (UUID, opcional)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    type: String,
    format: 'uuid',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID de técnico inválido. Debe ser un UUID válido' })
  technicianId?: string;

  @ApiProperty({
    description: 'Estado actual de la reparación',
    example: 'in_progress',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    enumName: 'ReparationStatus',
    default: 'pending',
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
    example: 'El equipo requiere seguimiento después de la reparación',
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
