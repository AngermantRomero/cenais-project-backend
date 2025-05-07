import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEquipmentDto {
  @ApiProperty({
    example: 'SN-12345',
    description: 'Número de serie único',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @ApiProperty({
    example: 'INV-789',
    description: 'Número de inventario único',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  inventoryNumber: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de inicio de explotación',
    required: false,
  })
  @IsDateString()
  startOfOperation?: Date;
}
