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

  // ==================== MÉTODOS EXISTENTES ====================

  async create(createDto: CreateEquipmentStateHistoryDto) {
    const equipment = await this.equipmentRepo.findOne({
      where: { id: createDto.equipmentId },
    });
    if (!equipment) {
      throw new NotFoundException(
        `Equipo con ID ${createDto.equipmentId} no encontrado`,
      );
    }

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

  // ==================== NUEVOS MÉTODOS ====================

  /**
   * Obtener los últimos cambios de estado de todos los equipos
   * @param limit Número máximo de registros a devolver
   */
  async getLatestStateChanges(
    limit: number = 10,
  ): Promise<EquipmentStateHistory[]> {
    return this.historyRepo.find({
      relations: ['equipment', 'state'],
      order: { changedAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Calcular el tiempo que un equipo pasó en cada estado
   * @param equipmentId ID del equipo
   */
  async getTimeInStates(equipmentId: string): Promise<any> {
    const history = await this.historyRepo.find({
      where: { equipment: { id: equipmentId } },
      relations: ['state'],
      order: { changedAt: 'ASC' },
    });

    if (history.length === 0) {
      return {};
    }

    const totalTime: any = {};

    for (let i = 0; i < history.length; i++) {
      const current = history[i];
      const next = history[i + 1];

      if (next) {
        // Tiempo entre este cambio y el siguiente
        const duration = next.changedAt.getTime() - current.changedAt.getTime();
        const hours = duration / (1000 * 60 * 60);

        if (!totalTime[current.state.name]) {
          totalTime[current.state.name] = 0;
        }
        totalTime[current.state.name] += hours;
      } else {
        // Si es el último registro, calcular hasta ahora
        const duration = new Date().getTime() - current.changedAt.getTime();
        const hours = duration / (1000 * 60 * 60);

        if (!totalTime[current.state.name]) {
          totalTime[current.state.name] = 0;
        }
        totalTime[current.state.name] += hours;
      }
    }

    return totalTime;
  }

  /**
   * Obtener estadísticas de cambios por usuario
   * @param userId ID del usuario (opcional)
   */
  async getChangesByUser(userId?: string): Promise<any[]> {
    const queryBuilder = this.historyRepo
      .createQueryBuilder('history')
      .select('history.changedBy', 'user')
      .addSelect('COUNT(history.id)', 'count')
      .groupBy('history.changedBy')
      .orderBy('count', 'DESC');

    if (userId) {
      queryBuilder.where('history.changedBy = :userId', { userId });
    }

    return queryBuilder.getRawMany();
  }

  /**
   * Obtener resumen de cambios por período
   * @param days Número de días hacia atrás
   */
  async getChangesSummary(days: number = 30): Promise<any[]> {
    const date = new Date();
    date.setDate(date.getDate() - days);

    return this.historyRepo
      .createQueryBuilder('history')
      .select('DATE(history.changedAt)', 'date')
      .addSelect('COUNT(history.id)', 'count')
      .where('history.changedAt >= :date', { date })
      .groupBy('DATE(history.changedAt)')
      .orderBy('date', 'DESC')
      .getRawMany();
  }

  /**
   * Obtener estadísticas de cambios por estado
   */
  async getChangesByState(): Promise<any[]> {
    return this.historyRepo
      .createQueryBuilder('history')
      .leftJoinAndSelect('history.state', 'state')
      .select('state.name', 'stateName')
      .addSelect('COUNT(history.id)', 'count')
      .groupBy('state.id')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  /**
   * Obtener el historial completo con paginación
   * @param page Número de página
   * @param limit Elementos por página
   */
  async getPaginatedHistory(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: EquipmentStateHistory[]; total: number }> {
    const [data, total] = await this.historyRepo.findAndCount({
      relations: ['equipment', 'state'],
      order: { changedAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total };
  }
}
