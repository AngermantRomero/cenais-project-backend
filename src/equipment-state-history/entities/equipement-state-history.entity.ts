import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Index,
  Column,
} from 'typeorm';
import { Equipment } from '../../equipments/entities/equipment.entity';
import { TypeState } from '../../type-state/entities/type-state.entity';

@Entity()
@Index(['equipment', 'changedAt']) // Índice compuesto para búsquedas eficientes
export class EquipmentStateHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Equipment, (equipment) => equipment.stateHistory)
  equipment: Equipment;

  @ManyToOne(() => TypeState)
  state: TypeState;

  @CreateDateColumn({ type: 'timestamp' })
  changedAt: Date;

  @Column({ type: 'uuid', nullable: true })
  changedBy?: string; // ID del usuario que realizó el cambio
}
