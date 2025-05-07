import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class EquipmentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID autogenerado',
  })
  id: string;

  @ApiProperty({ example: 'SN-12345', description: 'Número de serie único' })
  serialNumber: string;

  @ApiProperty({ example: 'INV-789', description: 'Número de inventario' })
  inventoryNumber: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de inicio de explotación',
  })
  startOfOperation: Date;
}
