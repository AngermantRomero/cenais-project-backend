import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Equipment {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID autogenerado',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'SN-12345', description: 'Número de serie único' })
  @Column({ length: 45, unique: true })
  serialNumber: string;

  @ApiProperty({ example: 'INV-789', description: 'Número de inventario' })
  @Column({ length: 45, unique: true })
  inventoryNumber: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de inicio de explotación',
  })
  @Column({ name: 'start_of_operation', type: 'date' })
  startOfOperation: Date;
}
