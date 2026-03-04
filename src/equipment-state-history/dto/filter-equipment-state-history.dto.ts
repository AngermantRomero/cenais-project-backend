import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsDateString, IsOptional, IsISO8601 } from 'class-validator';

export class FilterEquipmentStateHistoryDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filtrar por ID de equipo',
  })
  @IsUUID()
  @IsOptional()
  equipmentId?: string;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: 'Fecha de inicio (YYYY-MM-DD)',
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: 'Fecha de fin (YYYY-MM-DD)',
  })
  @IsISO8601()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Filtrar por ID de estado',
  })
  @IsUUID()
  @IsOptional()
  stateId?: string;
}
