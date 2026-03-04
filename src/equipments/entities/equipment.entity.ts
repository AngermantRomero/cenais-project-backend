import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';

@Entity('equipment')
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

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del fabricante',
  })
  @Column({ name: 'idMaker', type: 'varchar', length: 36 })
  idMaker: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del tipo de equipo',
  })
  @Column({ name: 'type_equipement_id', type: 'varchar', length: 36 })
  type_equipement_id: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del estado actual',
    nullable: true,
  })
  @Column({
    name: 'current_state_id',
    type: 'varchar',
    length: 36,
    nullable: true,
  })
  current_state_id: string;

  // Relaciones
  @ApiProperty({ type: () => Maker, description: 'Fabricante del equipo' })
  @ManyToOne(() => Maker, (maker) => maker.equipement)
  @JoinColumn({ name: 'idMaker' })
  maker: Maker;

  @ApiProperty({ type: () => Model, description: 'Modelo del equipo' })
  @ManyToOne(() => Model, (model) => model.equipments)
  @JoinColumn({ name: 'id' }) // ⚠️ Verifica si este name es correcto
  model: Model;

  @ApiProperty({ type: () => TypeEquipement, description: 'Tipo de equipo' })
  @ManyToOne(
    () => TypeEquipement,
    (typeEquipement) => typeEquipement.equipement,
  )
  @JoinColumn({ name: 'type_equipement_id' })
  typeEquipement: TypeEquipement;

  @ApiProperty({
    type: () => TypeState,
    description: 'Estado actual del equipo',
    nullable: true,
  })
  @ManyToOne(() => TypeState, { nullable: true })
  @JoinColumn({ name: 'current_state_id' })
  currentState: TypeState;

  @ApiProperty({
    type: () => [EquipmentStateHistory],
    description: 'Histórico de estados del equipo',
  })
  @OneToMany(() => EquipmentStateHistory, (history) => history.equipment)
  stateHistory: EquipmentStateHistory[];
}
