import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Maker } from '../maker/entities/maker.entity';
import { Model } from '../model/entities/model.entity';
import { EntityManager } from 'typeorm';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';

@Injectable()
export class EquipmentsService {
  constructor(
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    @InjectRepository(Maker)
    private readonly makerRepository: Repository<Maker>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(TypeState)
    private readonly typeStateRepository: Repository<TypeState>,
    private readonly entityManager: EntityManager,
    @InjectRepository(TypeEquipement)
    private readonly typeEquipementRepository: Repository<TypeEquipement>,
    @InjectRepository(EquipmentStateHistory)
    private readonly historyRepository: Repository<EquipmentStateHistory>,
    private readonly dataSource: DataSource,
  ) {}

  // --- Métodos CRUD principales ---
  async create(createDto: CreateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(createDto);

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const [maker, model, typeEquipement, initialState] = await Promise.all([
        this.validateMaker(createDto.makerId, transactionalEntityManager),
        this.validateModel(
          createDto.modelId,
          createDto.makerId,
          transactionalEntityManager,
        ),
        this.validateTypeEquipement(createDto.typeEquipementId),
        this.validateInitialState(
          createDto.initialStateId,
          transactionalEntityManager,
        ),
      ]);

      const equipment = this.equipmentRepository.create({
        serialNumber: createDto.serialNumber,
        inventoryNumber: createDto.inventoryNumber,
        startOfOperation: createDto.startOfOperation,
        maker,
        model,
        typeEquipement,
        currentState: initialState,
      });

      const savedEquipment = await transactionalEntityManager.save(equipment);

      await transactionalEntityManager.save(EquipmentStateHistory, {
        equipment: { id: savedEquipment.id },
        state: initialState,
        changedBy: 'system',
      });

      return savedEquipment;
    });
  }

  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      relations: ['maker', 'model', 'typeEquipement', 'currentState'],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: ['maker', 'model', 'typeEquipement', 'currentState'],
    });

    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipment;
  }

  async update(id: string, updateDto: UpdateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(updateDto, id);
    return this.entityManager.transaction(async (manager) => {
      const equipment = await this.findOne(id);

      // Actualizar campos básicos
      if (updateDto.serialNumber)
        equipment.serialNumber = updateDto.serialNumber;
      if (updateDto.inventoryNumber)
        equipment.inventoryNumber = updateDto.inventoryNumber;
      if (updateDto.startOfOperation)
        equipment.startOfOperation = updateDto.startOfOperation;

      // Actualizar relaciones
      if (updateDto.makerId) {
        equipment.maker = await this.validateMaker(updateDto.makerId);
      }

      if (updateDto.modelId) {
        const makerId = updateDto.makerId || equipment.maker.idMaker;
        equipment.model = await this.validateModel(updateDto.modelId, makerId);
      }

      if (updateDto.typeEquipementId) {
        equipment.typeEquipement = await this.validateTypeEquipement(
          updateDto.typeEquipementId,
        );
      }

      if (updateDto.initialStateId) {
        equipment.currentState = await this.validateInitialState(
          updateDto.initialStateId,
        );
        await this.historyRepository.save({
          equipment: { id },
          state: { id: updateDto.initialStateId },
          changedBy: 'system',
        });
      }

      return manager.save(equipment);
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.equipmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
  }

  // --- Métodos de consulta ---
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
        `Equipo con serial ${serialNumber} no encontrado`,
      );
    }

    return equipment;
  }

  async findByMaker(makerId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { maker: { idMaker: makerId } },
      relations: ['model'],
    });
  }

  async findByModel(modelId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { model: { id: modelId } },
      relations: ['maker'],
    });
  }

  // --- Métodos de validación ---
  private async validateInitialState(
    stateId: string,
    manager = this.typeStateRepository.manager,
  ): Promise<TypeState> {
    const state = await manager.findOneBy(TypeState, { id: stateId });
    if (!state)
      throw new NotFoundException(`Estado con ID ${stateId} no encontrado`);
    return state;
  }

  private async validateTypeEquipement(id: string): Promise<TypeEquipement> {
    const typeEquipement = await this.typeEquipementRepository.findOne({
      where: { id },
      relations: ['equipment'], // Carga la relación si es necesario
    });

    if (!typeEquipement) {
      throw new NotFoundException(`TypeEquipement with ID ${id} not found`);
    }

    return typeEquipement;
  }

  private async validateUniqueFields(
    dto: CreateEquipmentDto | UpdateEquipmentDto,
    excludeId?: string,
  ): Promise<void> {
    const query = this.equipmentRepository
      .createQueryBuilder('eq')
      .where('eq.serialNumber = :serial OR eq.inventoryNumber = :inventory', {
        serial: dto.serialNumber,
        inventory: dto.inventoryNumber,
      });

    if (excludeId) {
      query.andWhere('eq.id != :id', { id: excludeId });
    }

    const existing = await query.getOne();

    const errors: string[] = [];
    if (existing?.serialNumber === dto.serialNumber) {
      errors.push(`Serial ${dto.serialNumber} ya existe`);
    }
    if (existing?.inventoryNumber === dto.inventoryNumber) {
      errors.push(`Inventario ${dto.inventoryNumber} ya existe`);
    }

    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Error de validación', errors });
    }
  }

  private async validateMaker(
    makerId: string,
    manager = this.makerRepository.manager,
  ): Promise<Maker> {
    const maker = await manager.findOneBy(Maker, { idMaker: makerId });
    if (!maker)
      throw new NotFoundException(`Fabricante con ID ${makerId} no encontrado`);
    return maker;
  }

  private async validateModel(
    modelId: string,
    makerId: string,
    manager = this.modelRepository.manager,
  ): Promise<Model> {
    const model = await manager.findOne(Model, {
      where: { id: modelId, maker: { idMaker: makerId } },
      relations: ['maker'],
    });
    if (!model)
      throw new NotFoundException(
        `Modelo ${modelId} no pertenece al fabricante ${makerId}`,
      );
    return model;
  }
  async getStateHistory(id: string): Promise<EquipmentStateHistory[]> {
    // Verificar que el equipo existe primero
    const equipmentExists = await this.equipmentRepository.existsBy({ id });
    if (!equipmentExists) {
      throw new NotFoundException(`Equipment with ID ${id} not found`);
    }

    return this.historyRepository.find({
      where: { equipment: { id } },
      relations: ['state', 'equipment'],
      order: { changedAt: 'DESC' }, // Ordenar por fecha descendente
      select: {
        id: true,
        changedAt: true,
        changedBy: true,
        state: {
          id: true,
          name: true,
          description: true,
        },
      },
    });
  }
  async recordStateChange(
    equipmentId: string,
    newStateId: string,
    changedBy: string = 'system',
  ): Promise<EquipmentStateHistory> {
    await this.validateInitialState(newStateId);
    return this.historyRepository.save({
      equipment: { id: equipmentId },
      state: { id: newStateId },
      changedBy,
      changedAt: new Date(), // Fecha actual automática
    });
  }
  async changeEquipmentState(
    equipmentId: string,
    newStateId: string,
    changedBy: string,
  ): Promise<Equipment> {
    // Validar que el equipo existe
    const equipment = await this.equipmentRepository.findOneBy({
      id: equipmentId,
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${equipmentId} not found`);
    }

    // Validar que el nuevo estado existe
    const newState = await this.typeStateRepository.findOneBy({
      id: newStateId,
    });
    if (!newState) {
      throw new NotFoundException(`State with ID ${newStateId} not found`);
    }

    // Iniciar transacción para operaciones atómicas
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        // Actualizar estado actual del equipo
        equipment.currentState = newState;
        await transactionalEntityManager.save(equipment);

        // Registrar el cambio en el historial
        await transactionalEntityManager.save(EquipmentStateHistory, {
          equipment: { id: equipmentId },
          state: { id: newStateId },
          changedBy,
          changedAt: new Date(),
        });

        return equipment;
      },
    );
  }
  async findByCurrentState(stateId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { currentState: { id: stateId } },
      relations: ['maker', 'model', 'typeEquipement', 'currentState'],
      order: { inventoryNumber: 'ASC' }, // Orden alfabético por número de inventario
    });
  }
}
