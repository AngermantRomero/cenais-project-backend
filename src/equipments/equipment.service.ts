import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private equipmentsRepository: Repository<Equipment>,
  ) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    if (
      !createEquipmentDto.serialNumber ||
      !createEquipmentDto.inventoryNumber
    ) {
      throw new Error('Serial number e inventory number son requeridos');
    }

    const newEquipment = this.equipmentsRepository.create(createEquipmentDto);

    return await this.equipmentsRepository.save(newEquipment);
  }

  async findAll(): Promise<Equipment[]> {
    return await this.equipmentsRepository.find();
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentsRepository.findOneBy({ id: id });
    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return equipment;
  }
  async findByDate(date: string): Promise<Equipment[]> {
    return await this.equipmentsRepository.find({
      where: {
        startOfOperation: Raw((alias) => `${alias} = '${date}'`),
      },
    });
  }

  async update(id: string, updateData: UpdateEquipmentDto): Promise<Equipment> {
    const existingEquipment = await this.findOne(id);
    if (!existingEquipment) {
      throw new NotFoundException('Equipo no encontrado');
    }
    Object.assign(existingEquipment, updateData);
    return this.equipmentsRepository.save(existingEquipment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipo con ID ${id} no existe`);
    }
  }
}
