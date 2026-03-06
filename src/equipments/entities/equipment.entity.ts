import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Maker } from '../../maker/entities/maker.entity';
import { Model } from '../../model/entities/model.entity';
import { TypeEquipement } from '../../type-equipement/entities/type-equipement.entity';
import { TypeState } from '../../type-state/entities/type-state.entity';
import { EquipmentStateHistory } from '../../equipment-state-history/entities/equipement-state-history.entity';
import { Sites } from '../../sites/entities/sites.entity';
import { Repair } from '../../repairs/entities/repair.entity';

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
    type: () => Sites,
    description: 'Sitio donde está ubicado el equipo',
  })
  @ManyToOne(() => Sites, (site) => site.equipments, {
    eager: false,
    nullable: true,
  })
  @JoinColumn({ name: 'site_id' })
  site: Sites | null;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del sitio',
    required: false,
  })
  @Column({ name: 'site_id', nullable: true })
  siteId: string;

  @ApiProperty({
    example: '2023-01-15',
    description: 'Fecha de inicio de explotación',
  })
  @Column({ name: 'start_of_operation', type: 'date' })
  startOfOperation: Date;

  // Relación con Maker (CORREGIDA)
  @ManyToOne(() => Maker, (maker) => maker.equipement)
  @JoinColumn({ name: 'maker_id' })
  maker: Maker;

  @Column({ name: 'maker_id', nullable: true })
  makerId: string;

  // Relación con Model (CORREGIDA)
  @ManyToOne(() => Model, (model) => model.equipments)
  @JoinColumn({ name: 'model_id' })
  model: Model;

  @Column({ name: 'model_id', nullable: true })
  modelId: string;

  // Relación con TypeEquipement (VERIFICAR)
  @ManyToOne(
    () => TypeEquipement,
    (typeEquipement) => typeEquipement.equipement,
  )
  @JoinColumn({ name: 'type_equipement_id' })
  typeEquipement: TypeEquipement;

  @Column({ name: 'type_equipement_id', nullable: true })
  typeEquipementId: string;

  // Relación con TypeState
  @ManyToOne(() => TypeState, { eager: true })
  @JoinColumn({ name: 'current_state_id' })
  currentState: TypeState;

  @Column({ name: 'current_state_id', nullable: true })
  currentStateId: string;

  // Relación con historial de estados
  @OneToMany(() => EquipmentStateHistory, (history) => history.equipment)
  stateHistory: EquipmentStateHistory[];

  // Relación con reparaciones
  @OneToMany(() => Repair, (repair) => repair.equipment)
  repairs: Repair[];
}
