import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  Column,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Equipment } from '../../equipments/entities/equipment.entity';
import { TypeState } from '../../type-state/entities/type-state.entity';

@Entity('equipment_state_history')
@Index(['equipment', 'changedAt'])
export class EquipmentStateHistory {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID autogenerado',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: () => Equipment, description: 'Equipo relacionado' })
  @ManyToOne(() => Equipment, (equipment) => equipment.stateHistory)
  @JoinColumn({ name: 'equipmentId' })
  equipment: Equipment;

  @ApiProperty({ type: () => TypeState, description: 'Estado aplicado' })
  @ManyToOne(() => TypeState)
  @JoinColumn({ name: 'stateId' })
  state: TypeState;

  @ApiProperty({
    example: '2023-01-15T10:30:00.000Z',
    description: 'Fecha del cambio',
  })
  @CreateDateColumn({ type: 'timestamp' })
  changedAt: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario que realizó el cambio',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 36, nullable: true })
  changedBy: string;
}
