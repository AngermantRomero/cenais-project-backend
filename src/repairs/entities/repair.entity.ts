import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Equipment } from '../../equipments/entities/equipment.entity';
import { User } from '../../users/entities/user.entity';

@Entity('repairs')
export class Repair {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2026-03-02' })
  @Column({ type: 'date', name: 'start_date' })
  startDate: Date;

  @ApiProperty({ example: '2026-03-10', required: false })
  @Column({ type: 'date', name: 'end_date', nullable: true })
  endDate: Date;

  @ApiProperty({ example: 'Seismic sensor repair - component replacement' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ example: 'in_progress', default: 'in_progress' })
  @Column({ length: 50, nullable: true })
  status: string;

  @ApiProperty({
    example: 'Additional notes about the repair',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  observations: string;

  @ApiProperty({ type: () => Equipment })
  @ManyToOne(() => Equipment, (equipment) => equipment.repairs, {
    eager: false,
  })
  @JoinColumn({ name: 'equipment_id' })
  equipment: Equipment;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Column({ name: 'equipment_id', nullable: false })
  equipmentId: string;

  @ApiProperty({ type: () => User, required: false })
  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'technician_id' })
  technician: User | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @Column({ name: 'technician_id', nullable: true })
  technicianId: string | null;

  @ApiProperty({ example: '2026-03-02T12:00:00Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2026-03-02T12:00:00Z' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  setDefaultValues() {
    // Establecer startDate a la fecha actual si no se proporcionó
    if (!this.startDate) {
      const today = new Date();
      // Guardar solo la parte de fecha (YYYY-MM-DD)
      this.startDate = new Date(today.toISOString().split('T')[0]);
    }

    if (!this.status) {
      this.status = 'in_progress';
    }
  }
}
