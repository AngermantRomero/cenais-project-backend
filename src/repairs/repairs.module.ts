import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { Reparation } from './entities/repair.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';
import { TypeStateModule } from 'src/type-state/type-state.module';
@Module({
<<<<<<< Updated upstream
  imports: [TypeOrmModule.forFeature([Reparation, Equipment, User])],
=======
  imports: [
    TypeOrmModule.forFeature([
      Repair,
      Equipment,
      User,
      TypeState,
      EquipmentStateHistory,
    ]),
    TypeStateModule,
  ],
>>>>>>> Stashed changes
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService],
})
export class RepairsModule {}
