import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Maker } from '../maker/entities/maker.entity';
import { Model } from '../model/entities/model.entity';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Maker)
    private readonly makerRepository: Repository<Maker>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
  ) {}

  async create(createDto: CreateEquipmentDto): Promise<Equipment> {
    // Validar campos únicos
    await this.validateUniqueFields(createDto);

    // Validar y obtener relaciones
    const [maker, model] = await Promise.all([
      this.validateMaker(createDto.makerId),
      this.validateModel(createDto.modelId, createDto.makerId),
    ]);

    // Crear equipo
    const equipment = this.equipmentRepository.create({
      serialNumber: createDto.serialNumber,
      inventoryNumber: createDto.inventoryNumber,
      startOfOperation: createDto.startOfOperation,
      maker,
      model,
    });

    try {
      return await this.equipmentRepository.save(equipment);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new BadRequestException(
          `Error al crear el equipo: ${error.message}`,
        );
      }
      throw new BadRequestException('Error desconocido al crear el equipo');
    }
  }

  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      relations: ['maker', 'model'],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['maker', 'model'],
    });

    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipment;
  }

  async update(id: string, updateDto: UpdateEquipmentDto): Promise<Equipment> {
    const equipment = await this.findOne(id);

    // Validar campos únicos si se actualizan
    if (updateDto.serialNumber || updateDto.inventoryNumber) {
      await this.validateUniqueFields(updateDto, id);
    }

    // Actualizar campos simples
    if (updateDto.serialNumber) equipment.serialNumber = updateDto.serialNumber;
    if (updateDto.inventoryNumber)
      equipment.inventoryNumber = updateDto.inventoryNumber;
    if (updateDto.startOfOperation)
      equipment.startOfOperation = updateDto.startOfOperation;

    // Actualizar relaciones si se proporcionan
    if (updateDto.makerId) {
      equipment.maker = await this.validateMaker(updateDto.makerId);
    }

    if (updateDto.modelId) {
      const makerId = updateDto.makerId || equipment.maker.idMaker;
      equipment.model = await this.validateModel(updateDto.modelId, makerId);
    }

    return this.equipmentRepository.save(equipment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
  }

  async findByDate(date: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { startOfOperation: new Date(date) },
      relations: ['maker', 'model'],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findBySerialNumber(serialNumber: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { serialNumber },
      relations: ['maker', 'model'],
    });

    if (!equipment) {
      throw new NotFoundException(
        `Equipo con serial number ${serialNumber} no encontrado`,
      );
    }

    return equipment;
  }

  async findByMaker(makerId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { maker: { idMaker: makerId } },
      relations: ['model'],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findByModel(modelId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { model: { id: modelId } },
      relations: ['maker'],
    });
  }

  // --- Métodos auxiliares ---
  private async validateUniqueFields(
    dto: CreateEquipmentDto | UpdateEquipmentDto,
    excludeId?: string,
  ): Promise<void> {
    if (dto.serialNumber) {
      const existing = await this.equipmentRepository.findOneBy({
        serialNumber: dto.serialNumber,
      });
      if (existing && (!excludeId || existing.id !== excludeId)) {
        throw new BadRequestException('El serial number ya está en uso');
      }
    }

    if (dto.inventoryNumber) {
      const existing = await this.equipmentRepository.findOneBy({
        inventoryNumber: dto.inventoryNumber,
      });
      if (existing && (!excludeId || existing.id !== excludeId)) {
        throw new BadRequestException('El inventory number ya está en uso');
      }
    }
  }

  private async validateMaker(makerId: string): Promise<Maker> {
    const maker = await this.makerRepository.findOneBy({ idMaker: makerId });
    if (!maker) {
      throw new NotFoundException(`Fabricante con ID ${makerId} no encontrado`);
    }
    return maker;
  }

  private async validateModel(
    modelId: string,
    makerId: string,
  ): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: { id: modelId, maker: { idMaker: makerId } },
      relations: ['maker'],
    });
    if (!model) {
      throw new NotFoundException(
        `Modelo con ID ${modelId} no encontrado o no pertenece al fabricante especificado`,
      );
    }
    return model;
  }
}
