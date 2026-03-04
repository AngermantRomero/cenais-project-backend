import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';

export class FilterReparationDto {
  @ApiProperty({
    description: 'Filtrar por ID de equipo',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID de equipo inválido' })
  equipmentId?: string;

  @ApiProperty({
    description: 'Filtrar por ID de técnico',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID de técnico inválido' })
  technicianId?: string;

  @ApiProperty({
    description: 'Filtrar por estado de reparación',
    example: 'in_progress',
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    required: false,
    type: String,
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'], {
    message: 'Estado no válido',
  })
  status?: string;

  @ApiProperty({
    description: 'Filtrar por fecha de inicio desde (YYYY-MM-DD)',
    example: '2026-01-01',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha inicial inválida' })
  startDateFrom?: string;

  @ApiProperty({
    description: 'Filtrar por fecha de inicio hasta (YYYY-MM-DD)',
    example: '2026-12-31',
    required: false,
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha final inválida' })
  startDateTo?: string;
}
