import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepairsService } from './repairs.service';
import { RepairsController } from './repairs.controller';
import { Reparation } from './entities/repair.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reparation, Equipment, User])],
  controllers: [RepairsController],
  providers: [RepairsService],
  exports: [RepairsService],
})
export class RepairsModule {}
