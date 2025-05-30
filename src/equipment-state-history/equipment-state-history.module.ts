import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';
import { EquipmentStateHistoryService } from './equipment-state-history.service';
import { TypeStateModule } from '../type-state/type-state.module';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentStateHistory]), TypeStateModule],
  providers: [EquipmentStateHistoryService],
  exports: [TypeOrmModule, EquipmentStateHistoryService],
})
export class EquipmentStateHistoryModule {}
