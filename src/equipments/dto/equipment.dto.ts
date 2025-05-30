import { ApiProperty } from '@nestjs/swagger';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';

export class EquipmentDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'SN-12345' })
  serialNumber: string;

  @ApiProperty({ example: 'INV-789' })
  inventoryNumber: string;

  @ApiProperty({ example: '2023-01-15' })
  startOfOperation: Date;

  @ApiProperty({ type: () => Maker })
  maker: Maker;

  @ApiProperty({ type: () => Model })
  model: Model;
  @ApiProperty({ type: () => TypeEquipement })
  typeEquipement: TypeEquipement;

  @ApiProperty({ type: () => TypeState })
  currentState: TypeState;

  @ApiProperty({ type: () => [EquipmentStateHistory] })
  stateHistory: EquipmentStateHistory[];
}
