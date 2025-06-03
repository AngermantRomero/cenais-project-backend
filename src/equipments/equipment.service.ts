import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Maker } from '../maker/entities/maker.entity';
import { Sites } from 'src/sites/entities/sites.entity';
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
    @InjectRepository(Sites)
    private readonly siteRepository: Repository<Sites>,
    private readonly entityManager: EntityManager,
    @InjectRepository(TypeEquipement)
    private readonly typeEquipementRepository: Repository<TypeEquipement>,
    @InjectRepository(EquipmentStateHistory)
    private readonly historyRepository: Repository<EquipmentStateHistory>,
    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(EquipmentsService.name);
  async create(createDto: CreateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(createDto);

    return this.dataSource
      .transaction(async (transactionalEntityManager) => {
        // Validar y obtener todas las relaciones necesarias
        const [maker, model, typeEquipement, initialState] = await Promise.all([
          this.validateMaker(createDto.makerId, transactionalEntityManager),
          this.validateModel(
            createDto.modelId,
            createDto.makerId,
            transactionalEntityManager,
          ),
          this.validateTypeEquipement(
            createDto.typeEquipementId,
            transactionalEntityManager,
          ),
          this.validateInitialState(
            createDto.initialStateId,
            transactionalEntityManager,
          ),
        ]);

        // Crear el nuevo equipo
        const equipment = new Equipment();
        equipment.serialNumber = createDto.serialNumber;
        equipment.inventoryNumber = createDto.inventoryNumber;
        equipment.startOfOperation = createDto.startOfOperation;
        equipment.maker = maker;
        equipment.model = model;
        equipment.typeEquipement = typeEquipement;
        equipment.currentState = initialState;

        const savedEquipment = await transactionalEntityManager.save(equipment);

        await transactionalEntityManager.save(EquipmentStateHistory, {
          equipment: savedEquipment,
          state: initialState,
          changedBy: 'system',
          changedAt: new Date(),
        });

        this.logger.log(`Equipo creado con ID: ${savedEquipment.id}`);
        return savedEquipment;
      })
      .catch((error: unknown) => {
        const message =
          error instanceof Error ? error.message : 'Error desconocido';
        this.logger.error(`Error al crear equipo: ${message}`);
        throw error;
      });
  }
  async findAll(): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      relations: ['maker', 'model', 'typeEquipement', 'currentState'],
      order: { startOfOperation: 'DESC' },
    });
  }
  async assignToSite(
    equipmentId: string,
    siteCode: string,
  ): Promise<Equipment> {
    return this.entityManager.transaction(async (manager) => {
      const equipment = await manager.findOne(Equipment, {
        where: { id: equipmentId },
        relations: ['sites'],
      });

      if (!equipment) {
        throw new NotFoundException(
          `Equipo con ID ${equipmentId} no encontrado`,
        );
      }

      const site = await manager.findOne(Sites, {
        where: { code: siteCode },
      });

      if (!site) {
        throw new NotFoundException(
          `Sitio con código ${siteCode} no encontrado`,
        );
      }

      equipment.sites = site;

      return manager.save(equipment);
    });
  }

  async getEquipmentBySite(siteCode: string): Promise<Equipment[]> {
    const siteExists = await this.siteRepository.exist({
      where: { code: siteCode },
    });

    if (!siteExists) {
      throw new NotFoundException(`Sitio con código ${siteCode} no encontrado`);
    }

    return this.equipmentRepository.find({
      where: { sites: { code: siteCode } },
      relations: ['maker', 'model', 'typeEquipement', 'currentState', 'sites'],
      order: { inventoryNumber: 'ASC' },
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

  async removeFromSite(equipmentId: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id: equipmentId },
      relations: ['site'],
    });

    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${equipmentId} no encontrado`);
    }

    return this.equipmentRepository.save({
      ...equipment,
      site: null,
    });
  }

  async update(id: string, updateDto: UpdateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(updateDto, id);
    return this.entityManager.transaction(async (manager) => {
      const equipment = await this.findOne(id);

      if (updateDto.serialNumber)
        equipment.serialNumber = updateDto.serialNumber;
      if (updateDto.inventoryNumber)
        equipment.inventoryNumber = updateDto.inventoryNumber;
      if (updateDto.startOfOperation)
        equipment.startOfOperation = updateDto.startOfOperation;

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

  private async validateInitialState(
    stateId: string,
    manager = this.typeStateRepository.manager,
  ): Promise<TypeState> {
    const state = await manager.findOneBy(TypeState, { id: stateId });
    if (!state)
      throw new NotFoundException(`Estado con ID ${stateId} no encontrado`);
    return state;
  }

  private async validateTypeEquipement(
    id: string,
    manager: EntityManager = this.typeEquipementRepository.manager,
  ): Promise<TypeEquipement> {
    const typeEquipement = await manager.findOne(TypeEquipement, {
      where: { id },
    });

    if (!typeEquipement) {
      throw new NotFoundException(`Tipo de equipo con ID ${id} no encontrado`);
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
      changedAt: new Date(),
    });
  }
  async changeEquipmentState(
    equipmentId: string,
    newStateId: string,
    changedBy: string,
  ): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOneBy({
      id: equipmentId,
    });
    if (!equipment) {
      throw new NotFoundException(`Equipment with ID ${equipmentId} not found`);
    }
    const newState = await this.typeStateRepository.findOneBy({
      id: newStateId,
    });
    if (!newState) {
      throw new NotFoundException(`State with ID ${newStateId} not found`);
    }
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        equipment.currentState = newState;
        await transactionalEntityManager.save(equipment);

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
      order: { inventoryNumber: 'ASC' },
    });
  }
}
