import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';
import { CreateEquipmentStateHistoryDto } from './dto/create-equipment-state-history.dto';
import { FilterEquipmentStateHistoryDto } from './dto/filter-equipment-state-history.dto';
import { Equipment } from 'src/equipments/entities/equipment.entity';

@Injectable()
export class EquipmentStateHistoryService {
  constructor(
    @InjectRepository(EquipmentStateHistory)
    private readonly historyRepo: Repository<EquipmentStateHistory>,
  ) {}

  async create(createDto: CreateEquipmentStateHistoryDto) {
    const historyEntry = this.historyRepo.create({
      equipment: { id: createDto.equipmentId },
      state: { id: createDto.stateId },
      changedBy: createDto.changedBy,
    });
    return await this.historyRepo.save(historyEntry);
  }

  async findByEquipmentId(equipmentId: string) {
    return await this.historyRepo.find({
      where: { equipment: { id: equipmentId } },
      order: { changedAt: 'DESC' },
      relations: ['state'],
    });
  }

  async filter(query: FilterEquipmentStateHistoryDto) {
    // 1. Definir el tipo explícito para el objeto where
    const where: FindOptionsWhere<EquipmentStateHistory> = {};

    // 2. Asignaciones con validación de tipo
    if (query.equipmentId) {
      where.equipment = {
        id: query.equipmentId,
      } as FindOptionsWhere<Equipment>;
    }

    // 3. Manejo de fechas con validación
    if (query.startDate && query.endDate) {
      where.changedAt = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    return await this.historyRepo.find({
      where,
      relations: ['state', 'equipment'],
    });
  }
}
