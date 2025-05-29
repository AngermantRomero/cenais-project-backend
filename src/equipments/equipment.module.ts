import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentsController } from './equipment.controller';
import { EquipmentsService } from './equipment.service';
import { Equipment } from './entities/equipment.entity';
import { Maker } from 'src/maker/entities/maker.entity';
import { Model } from 'src/model/entities/model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Equipment, Maker, Model])],
  controllers: [EquipmentsController],
  providers: [EquipmentsService],
  exports: [EquipmentsService],
})
export class EquipmentsModule {}
