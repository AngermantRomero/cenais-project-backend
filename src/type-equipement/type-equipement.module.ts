import { Module } from '@nestjs/common';
import { TypeEquipementController } from './type-equipement.controller';
import { TypeEquipementService } from './type-equipement.service';
import { TypeEquipement } from './entities/type-equipement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEquipement])],
  controllers: [TypeEquipementController],
  providers: [TypeEquipementService],
})
export class TypeEquipementModule {}
