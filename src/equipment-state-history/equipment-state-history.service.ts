import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EquipmentStateHistory } from './entities/equipement-state-history.entity';
import { CreateEquipmentStateHistoryDto } from './dto/create-equipment-state-history.dto';
import { FilterEquipmentStateHistoryDto } from './dto/filter-equipment-state-history.dto';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { TypeState } from '../type-state/entities/type-state.entity';

@Injectable()
export class EquipmentStateHistoryService {
  constructor(
    @InjectRepository(EquipmentStateHistory)
    private readonly historyRepo: Repository<EquipmentStateHistory>,
    @InjectRepository(Equipment)
    private readonly equipmentRepo: Repository<Equipment>,
    @InjectRepository(TypeState)
    private readonly stateRepo: Repository<TypeState>,
  ) {}

  async create(createDto: CreateEquipmentStateHistoryDto) {
    // Verificar que el equipo existe
    const equipment = await this.equipmentRepo.findOne({
      where: { id: createDto.equipmentId },
    });
    if (!equipment) {
      throw new NotFoundException(
        `Equipo con ID ${createDto.equipmentId} no encontrado`,
      );
    }

    // Verificar que el estado existe
    const state = await this.stateRepo.findOne({
      where: { id: createDto.stateId },
    });
    if (!state) {
      throw new NotFoundException(
        `Estado con ID ${createDto.stateId} no encontrado`,
      );
    }

    const historyEntry = this.historyRepo.create({
      equipment: equipment,
      state: state,
      changedBy: createDto.changedBy,
    });

    return await this.historyRepo.save(historyEntry);
  }

  async createWithEntities(
    equipment: Equipment,
    state: TypeState,
    changedBy?: string,
  ) {
    const historyEntry = this.historyRepo.create({
      equipment: equipment,
      state: state,
      changedBy: changedBy,
    });

    return await this.historyRepo.save(historyEntry);
  }

  async findByEquipmentId(equipmentId: string) {
    return await this.historyRepo.find({
      where: { equipment: { id: equipmentId } },
      order: { changedAt: 'DESC' },
      relations: ['state', 'equipment'],
    });
  }

  async filter(query: FilterEquipmentStateHistoryDto) {
    const where: any = {};

    if (query.equipmentId) {
      where.equipment = { id: query.equipmentId };
    }

    if (query.stateId) {
      where.state = { id: query.stateId };
    }

    if (query.startDate && query.endDate) {
      where.changedAt = Between(
        new Date(query.startDate),
        new Date(query.endDate),
      );
    }

    return await this.historyRepo.find({
      where,
      relations: ['state', 'equipment'],
      order: { changedAt: 'DESC' },
    });
  }

  async getLastState(equipmentId: string) {
    return await this.historyRepo.findOne({
      where: { equipment: { id: equipmentId } },
      order: { changedAt: 'DESC' },
      relations: ['state'],
    });
  }
}
