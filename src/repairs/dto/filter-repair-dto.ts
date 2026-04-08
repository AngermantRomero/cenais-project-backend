import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';

export class FilterReparationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  equipmentId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4')
  technicianId?: string;

  @ApiProperty({
    required: false,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['pending', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
