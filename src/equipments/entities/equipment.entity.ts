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
import { Sites } from 'src/sites/entities/sites.entity';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';
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

  @ManyToOne(() => Maker, (maker) => maker.equipement)
  @JoinColumn({ name: 'idMaker' })
  maker: Maker;

  @ManyToOne(() => Model, (model) => model.equipement)
  @JoinColumn({ name: 'id' })
  model: Model;
  @ManyToOne(
    () => TypeEquipement,
    (typeEquipement) => typeEquipement.equipement,
  )
  @JoinColumn({ name: 'type_equipement_id' })
  typeEquipement: TypeEquipement;

  @ManyToOne(() => TypeState, { eager: true }) // Carga automática
  @JoinColumn({ name: 'current_state_id' })
  currentState: TypeState;

  @ManyToOne(() => Sites, (sites) => sites.equipments)
  @JoinColumn({ name: 'site_code', referencedColumnName: 'code' })
  sites: Sites;

  @OneToMany(() => EquipmentStateHistory, (history) => history.equipment)
  stateHistory: EquipmentStateHistory[];
}
