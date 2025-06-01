import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional } from 'class-validator';

export class CreateEquipmentStateHistoryDto {
  @ApiProperty({ description: 'ID del equipo' })
  @IsUUID()
  equipmentId: string;

  @ApiProperty({ description: 'ID del nuevo estado' })
  @IsUUID()
  stateId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  changedBy?: string;
}
