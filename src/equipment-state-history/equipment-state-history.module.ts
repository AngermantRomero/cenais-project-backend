import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';
import { EquipmentStateHistoryService } from './equipment-state-history.service';
import { EquipmentStateHistoryController } from './equipment-state-history.controller';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([EquipmentStateHistory, Equipment, TypeState]),
  ],
  providers: [EquipmentStateHistoryService],
  exports: [TypeOrmModule, EquipmentStateHistoryService],
})
export class EquipmentStateHistoryModule {}
