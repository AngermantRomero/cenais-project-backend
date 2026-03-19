import { ApiProperty } from '@nestjs/swagger';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';
import { Sites } from 'src/sites/entities/sites.entity';

export class EquipmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'SN-12345' })
  serialNumber: string;

  @ApiProperty({ example: 'INV-789' })
  inventoryNumber: string;

  @ApiProperty({ example: '2023-01-15' })
  startOfOperation: Date;

  @ApiProperty({ type: () => Maker, description: 'Fabricante del equipo' })
  maker: Maker;

  @ApiProperty({ type: () => Model, description: 'Modelo del equipo' })
  model: Model;

  @ApiProperty({ type: () => TypeEquipement, description: 'Tipo de equipo' })
  typeEquipement: TypeEquipement;

  @ApiProperty({ type: () => TypeState, description: 'Estado actual' })
  currentState: TypeState;

  // 👇 CAMPO NUEVO - SITIO
  @ApiProperty({
    type: () => Sites,
    description: 'Sitio donde está ubicado el equipo',
    nullable: true,
    required: false,
  })
  site?: Sites;

  @ApiProperty({
    type: () => [EquipmentStateHistory],
    description: 'Historial de estados del equipo',
    required: false,
  })
  stateHistory?: EquipmentStateHistory[];

  @ApiProperty({
    example: '2026-03-04T12:00:00Z',
    description: 'Fecha de creación del registro',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2026-03-04T12:00:00Z',
    description: 'Fecha de última actualización',
  })
  updatedAt?: Date;
}
