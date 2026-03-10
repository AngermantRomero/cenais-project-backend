import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Repair } from './entities/repair.entity';
import { CreateReparationDto } from './dto/create-repair.dto';
import { UpdateReparationDto } from './dto/update-repair.dto';
import { FilterReparationDto } from './dto/filter-repair-dto';
import { Equipment } from '../equipments/entities/equipment.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RepairsService {
  constructor(
    @InjectRepository(Repair)
    private repairRepo: Repository<Repair>,
    @InjectRepository(Equipment)
    private equipmentRepo: Repository<Equipment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createDto: CreateReparationDto) {
    // Verificar que el equipo existe
    const equipment = await this.equipmentRepo.findOne({
      where: { id: createDto.equipmentId },
    });
    if (!equipment) {
      throw new NotFoundException(
        `Equipment with ID ${createDto.equipmentId} not found`,
      );
    }

    // Verificar técnico si se proporciona
    if (createDto.technicianId) {
      const technician = await this.userRepo.findOne({
        where: { id: createDto.technicianId },
      });
      if (!technician) {
        throw new NotFoundException(
          `Técnico con ID ${createDto.technicianId} no encontrado`,
        );
      }
    }

    // Validar fechas

    const repair = this.repairRepo.create(createDto);
    return await this.repairRepo.save(repair);
  }

  async findAll(query: FilterReparationDto) {
    const where: any = {};

    // Aplicar filtros si existen
    if (query.equipmentId) {
      where.equipmentId = query.equipmentId;
    }

    if (query.technicianId) {
      where.technicianId = query.technicianId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDate) {
      const start = new Date(query.startDate);
      start.setHours(0, 0, 0, 0);
      if (query.endDate) {
        // Caso 1: Tanto fecha inicio como fecha fin
        const end = new Date(query.endDate);
        end.setHours(23, 59, 59, 999); // Fin del día

        where.startDate = Between(start, end);
      } else {
        where.startDate = Between(start, new Date('2099-12-31'));
      }
    } else if (query.endDate) {
      // Caso 3: Solo fecha fin - buscar hasta esa fecha
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      where.startDate = Between(new Date('1970-01-01'), end); // Desde "el principio"
    }
    // Buscar con relaciones anidadas
    return await this.repairRepo.find({
      where,
      relations: {
        equipment: {
          model: true,
          maker: true,
        },
        technician: true,
      },
      order: {
        startDate: 'DESC',
        createdAt: 'DESC',
      },
    });
  }
  async findOne(id: string): Promise<Repair> {
    const reparation = await this.repairRepo.findOne({
      where: { id },
      relations: {
        equipment: {
          model: true,
          maker: true,
        },
        technician: true,
      },
    });

    if (!reparation) {
      throw new NotFoundException(`Reparación con ID ${id} no encontrada`);
    }

    return reparation;
  }

  async findByEquipment(equipmentId: string) {
    return await this.repairRepo.find({
      where: { equipmentId },
      relations: ['technician'],
      order: { startDate: 'DESC' },
    });
  }

  async update(id: string, updateDto: UpdateReparationDto) {
    console.log('🔵 UPDATE - Recibido:', { id, updateDto });

    const repair = await this.findOne(id);
    console.log('🔵 Repair actual:', {
      id: repair.id,
      technicianId: repair.technicianId,
      technician: repair.technician,
    });

    // Si viene technicianId, validar que existe
    if (updateDto.technicianId !== undefined) {
      if (updateDto.technicianId === null) {
        // Quitar técnico
        repair.technician = null;
        repair.technicianId = null;
      } else {
        // Asignar nuevo técnico
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
      }
    }

    // Actualizar otros campos
    if (updateDto.startDate) repair.startDate = updateDto.startDate;
    if (updateDto.endDate !== undefined) repair.endDate = updateDto.endDate;
    if (updateDto.description) repair.description = updateDto.description;
    if (updateDto.status) repair.status = updateDto.status;
    if (updateDto.observations !== undefined)
      repair.observations = updateDto.observations;

    const updated = await this.repairRepo.save(repair);
    console.log('🔵 Repair actualizado:', {
      id: updated.id,
      technicianId: updated.technicianId,
      technician: updated.technician,
    });

    return updated;
  }

  async remove(id: string) {
    const repair = await this.findOne(id);
    return await this.repairRepo.remove(repair);
  }

  async completeRepair(id: string, observations?: string) {
    const repair = await this.findOne(id);

    repair.status = 'completed';
    repair.endDate = new Date();
    if (observations) {
      repair.observations = observations;
    }

    return await this.repairRepo.save(repair);
  }
}
