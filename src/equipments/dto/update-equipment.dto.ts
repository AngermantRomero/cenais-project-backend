import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

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
  @IsString()
  makerId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelId?: string;
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  typeEquipementId?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsString()
  currentStateId?: string;
}
