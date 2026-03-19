import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
<<<<<<< Updated upstream
import { Repository, Between } from 'typeorm';
import { Reparation } from './entities/repair.entity';
=======
import { Repository, Between, DataSource } from 'typeorm';
import { Repair } from './entities/repair.entity';
>>>>>>> Stashed changes
import { CreateReparationDto } from './dto/create-repair.dto';
import { UpdateReparationDto } from './dto/update-repair.dto';
import { FilterReparationDto } from './dto/filter-repair-dto';
import { Equipment } from '../equipments/entities/equipment.entity';
import { User } from '../users/entities/user.entity';
import { TypeState } from '../type-state/entities/type-state.entity';
import { EquipmentStateHistory } from '../equipment-state-history/entities/equipement-state-history.entity';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(Reparation)
    private repairRepo: Repository<Reparation>,
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(TypeState)
    private typeStateRepo: Repository<TypeState>,
    @InjectRepository(EquipmentStateHistory)
    private historyRepo: Repository<EquipmentStateHistory>,
    private dataSource: DataSource,
  ) {}

  async create(createDto: CreateReparationDto, userId?: string) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Crear la reparación
      const repair = manager.create(Repair, createDto);
      const savedRepair = await manager.save(repair);

      // 2. Obtener el estado "En reparación"
      const inRepairState = await manager.findOne(TypeState, {
        where: { name: 'En reparación' },
      });

      if (inRepairState) {
        // 3. Obtener nombre del usuario si se proporcionó
        let changedBy = 'system';
        if (userId) {
          const user = await manager.findOne(User, { where: { id: userId } });
          changedBy = user
            ? `${user.name} ${user.lastName || ''}`.trim()
            : 'system';
        }

        // 4. Actualizar el estado del equipo
        await manager.update(Equipment, createDto.equipmentId, {
          currentState: inRepairState,
        });

        // 5. Registrar en el historial con el nombre del usuario
        await manager.save(EquipmentStateHistory, {
          equipment: { id: createDto.equipmentId },
          state: inRepairState,
          changedBy: changedBy,
          changedAt: new Date(),
        });
      }

      return savedRepair;
    });
  }

  async findAll(query: FilterReparationDto) {
    const where: any = {};

    if (query.equipmentId) {
      where.equipmentId = query.equipmentId;
    }

    if (query.technicianId) {
      where.technicianId = query.technicianId;
    }

    if (query.status) {
      where.status = query.status;
    }

<<<<<<< Updated upstream
    if (query.startDateFrom && query.startDateTo) {
      where.startDate = Between(
        new Date(query.startDateFrom),
        new Date(query.startDateTo),
      );
=======
    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      if (query.endDate) {
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999);
        where.startDate = Between(start, end);
      } else {
        where.startDate = Between(start, new Date('2099-12-31'));
      }
    } else if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      where.startDate = Between(new Date('1970-01-01'), end);
>>>>>>> Stashed changes
    }

    return await this.repairRepo.find({
      where,
      relations: ['equipment', 'technician'],
      order: { startDate: 'DESC', createdAt: 'DESC' },
    });
  }

<<<<<<< Updated upstream
  async findOne(id: string) {
    const repair = await this.repairRepo.findOne({
=======
  async findOne(id: string): Promise<Repair> {
    const reparation = await this.repairRepo.findOne({
>>>>>>> Stashed changes
      where: { id },
      relations: ['equipment', 'technician'],
    });

    if (!repair) {
      throw new NotFoundException(`Reparación con ID ${id} no encontrada`);
    }

    return repair;
  }

  async findByEquipment(equipmentId: string) {
    return await this.repairRepo.find({
      where: { equipmentId },
      relations: ['technician'],
      order: { startDate: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateReparationDto) {
    const repair = await this.findOne(id);

<<<<<<< Updated upstream
    // Verificar técnico si se actualiza
    if (updateDto.technicianId) {
      const technician = await this.userRepo.findOne({
        where: { id: updateDto.technicianId },
      });
      if (!technician) {
        throw new NotFoundException(
          `Técnico con ID ${updateDto.technicianId} no encontrado`,
        );
=======
    // Si viene technicianId, validar que existe
    if (updateDto.technicianId !== undefined) {
      if (updateDto.technicianId === null) {
        repair.technician = null;
        repair.technicianId = null;
      } else {
        const technician = await this.userRepo.findOne({
          where: { id: updateDto.technicianId },
        });
        if (!technician) {
          throw new NotFoundException(
            `Técnico con ID ${updateDto.technicianId} no encontrado`,
          );
        }
        repair.technician = technician;
        repair.technicianId = technician.id;
>>>>>>> Stashed changes
      }
    }

    // Validar fechas si ambas están presentes
    const startDate = updateDto.startDate || repair.startDate;
    const endDate = updateDto.endDate || repair.endDate;

    if (endDate && new Date(endDate) < new Date(startDate)) {
      throw new BadRequestException(
        'La fecha de fin no puede ser menor a la fecha de inicio',
      );
    }

    Object.assign(repair, updateDto);
    return await this.repairRepo.save(repair);
  }

  async remove(id: string) {
    const repair = await this.findOne(id);
    return await this.repairRepo.remove(repair);
  }

  async completeRepair(id: string, observations?: string) {
    return this.dataSource.transaction(async (manager) => {
      // 1. Obtener la reparación
      const repair = await manager.findOne(Repair, {
        where: { id },
        relations: ['equipment'],
      });

      if (!repair) {
        throw new NotFoundException('Reparación no encontrada');
      }

      // 2. Actualizar la reparación
      repair.status = 'completed';
      repair.endDate = new Date();
      if (observations) {
        repair.observations = observations;
      }
      await manager.save(repair);

      // 3. Verificar si hay otras reparaciones activas para este equipo
      const activeRepairs = await manager.count(Repair, {
        where: {
          equipment: { id: repair.equipmentId },
          status: 'in_progress',
        },
      });

      // 4. Si no hay reparaciones activas, cambiar estado a "Operacional"
      if (activeRepairs === 0) {
        const operationalState = await manager.findOne(TypeState, {
          where: { name: 'Operacional' },
        });

        if (operationalState) {
          await manager.update(Equipment, repair.equipmentId, {
            currentState: operationalState,
          });

          await manager.save(EquipmentStateHistory, {
            equipment: { id: repair.equipmentId },
            state: operationalState,
            changedBy: 'system',
            changedAt: new Date(),
          });
        }
      }

      return repair;
    });
  }
}
