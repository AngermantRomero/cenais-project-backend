import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Equipment } from '../../equipments/entities/equipment.entity';

@Entity('type_state')
export class TypeState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Equipment, (equipment) => equipment.currentState)
  equipments: Equipment[];
}
