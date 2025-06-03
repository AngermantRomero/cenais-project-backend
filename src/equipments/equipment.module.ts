import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentsController } from './equipment.controller';
import { EquipmentsService } from './equipment.service';
import { Equipment } from './entities/equipment.entity';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';
import { EquipmentStateHistoryModule } from '../equipment-state-history/equipment-state-history.module';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { TypeEquipement } from '../type-equipement/entities/type-equipement.entity';
import { TypeStateModule } from 'src/type-state/type-state.module';
import { SitesModule } from '../sites/sites.module';
import { Sites } from '../sites/entities/sites.entity';
import { TypeEquipementModule } from 'src/type-equipement/type-equipement.module';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Equipment,
      Maker,
      Model,
      TypeState,
      TypeEquipement,
      EquipmentStateHistory,
      Sites,
    ]),
    EquipmentStateHistoryModule,
    TypeStateModule,
    TypeEquipementModule,
    SitesModule,
  ],
  controllers: [EquipmentsController],
  providers: [EquipmentsService],
  exports: [EquipmentsService],
})
export class EquipmentsModule {}
