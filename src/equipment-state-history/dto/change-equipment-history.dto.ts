import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class ChangeEquipmentStateDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del nuevo estado',
  })
  @IsUUID()
  @IsNotEmpty()
  stateId: string;

  @ApiPropertyOptional({
    example: 'Equipo enviado a mantenimiento preventivo',
    description: 'Observaciones del cambio',
  })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario que realiza el cambio',
  })
  @IsUUID()
  @IsOptional()
  changedBy?: string;
}
