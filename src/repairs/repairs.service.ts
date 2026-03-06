import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

    if (query.equipmentId) {
      where.equipmentId = query.equipmentId;
    }

    if (query.technicianId) {
      where.technicianId = query.technicianId;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.startDateFrom && query.startDateTo) {
      where.startDate = Between(
        new Date(query.startDateFrom),
        new Date(query.startDateTo),
      );
    }

    return await this.repairRepo.find({
      where,
      relations: ['equipment', 'technician'],
      order: { startDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const repair = await this.repairRepo.findOne({
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

    // Verificar técnico si se actualiza
    if (updateDto.technicianId) {
      const technician = await this.userRepo.findOne({
        where: { id: updateDto.technicianId },
      });
      if (!technician) {
        throw new NotFoundException(
          `Técnico con ID ${updateDto.technicianId} no encontrado`,
        );
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
    const repair = await this.findOne(id);

    repair.status = 'completed';
    repair.endDate = new Date();
    if (observations) {
      repair.observations = observations;
    }

    return await this.repairRepo.save(repair);
  }
}
