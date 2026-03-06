import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Maker } from '../maker/entities/maker.entity';
import { Model } from '../model/entities/model.entity';
import { EntityManager } from 'typeorm';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';
import { Sites } from 'src/sites/entities/sites.entity';
import { PaginatedResponse } from './interface/equipment.interface';
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
    @InjectRepository(Sites)
    private readonly siteRepository: Repository<Sites>,

    private readonly dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(EquipmentsService.name);
  async create(createDto: CreateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(createDto);

    return this.dataSource
      .transaction(async (transactionalEntityManager) => {
        // Validar y obtener todas las relaciones necesarias
        const [maker, model, typeEquipement, initialState, site] =
          await Promise.all([
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
            createDto.siteId
              ? this.validateSite(createDto.siteId, transactionalEntityManager)
              : Promise.resolve(null),
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
        equipment.site = site;

        // Guardar el equipo
        const savedEquipment = await transactionalEntityManager.save(equipment);

        // Registrar el cambio de estado inicial
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
      relations: [
        'maker',
        'model',
        'typeEquipement',
        'currentState',
        'site',
        'site.province',
      ],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { id },
      relations: [
        'maker',
        'model',
        'typeEquipement',
        'currentState',
        'site',
        'site.province',
      ],
    });

    if (!equipment) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipment;
  }

  async update(id: string, updateDto: UpdateEquipmentDto): Promise<Equipment> {
    await this.validateUniqueFields(updateDto, id);

    return this.dataSource.transaction(async (transactionalEntityManager) => {
      // 1. Obtener el equipo con sus relaciones actuales
      const equipment = await this.findOne(id);

      // 2. Actualizar campos básicos
      if (updateDto.serialNumber) {
        equipment.serialNumber = updateDto.serialNumber;
      }
      if (updateDto.inventoryNumber) {
        equipment.inventoryNumber = updateDto.inventoryNumber;
      }
      if (updateDto.startOfOperation) {
        equipment.startOfOperation = updateDto.startOfOperation;
      }

      // 3. Actualizar relaciones (usando transactionalEntityManager)
      if (updateDto.makerId) {
        equipment.maker = await this.validateMaker(
          updateDto.makerId,
          transactionalEntityManager,
        );
      }

      if (updateDto.modelId) {
        const makerId = updateDto.makerId || equipment.maker?.idMaker;
        if (!makerId) {
          throw new BadRequestException(
            'Se requiere makerId para validar el modelo',
          );
        }
        equipment.model = await this.validateModel(
          updateDto.modelId,
          makerId,
          transactionalEntityManager,
        );
      }

      if (updateDto.typeEquipementId) {
        equipment.typeEquipement = await this.validateTypeEquipement(
          updateDto.typeEquipementId,
          transactionalEntityManager,
        );
      }

      // 4. Actualizar SITE (el campo que te daba error)
      if (updateDto.siteId !== undefined) {
        equipment.site = updateDto.siteId
          ? await this.validateSite(
              updateDto.siteId,
              transactionalEntityManager,
            )
          : null;
      }

      // 5. Manejar cambio de estado
      if (
        updateDto.currentStateId &&
        updateDto.currentStateId !== equipment.currentState?.id
      ) {
        const newState = await this.validateInitialState(
          updateDto.currentStateId,
          transactionalEntityManager,
        );

        equipment.currentState = newState;

        // Registrar en historial
        await transactionalEntityManager.save(EquipmentStateHistory, {
          equipment: { id },
          state: newState,
          changedBy: updateDto.changedBy || 'system',
          changedAt: new Date(),
        });
      }

      // Guardar todo en la misma transacción
      const updatedEquipment = await transactionalEntityManager.save(equipment);

      this.logger.log(`Equipo actualizado con ID: ${updatedEquipment.id}`);
      return updatedEquipment;
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
    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new BadRequestException(
        'Formato de fecha inválido. Use YYYY-MM-DD',
      );
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    return this.equipmentRepository.find({
      where: {
        startOfOperation: Between(startDate, endDate),
      },
      relations: ['maker', 'model', 'site'],
      order: { startOfOperation: 'DESC' },
    });
  }

  async findBySerialNumber(serialNumber: string): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findOne({
      where: { serialNumber },
      relations: ['maker', 'model', 'typeEquipement', 'currentState', 'site'],
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
      relations: ['model', 'currentState', 'site'],
    });
  }

  async findByModel(modelId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { model: { id: modelId } },
      relations: ['maker', 'currentState', 'site'],
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
  async findBySite(siteId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { site: { id: siteId } },
      relations: ['maker', 'model', 'currentState'],
      order: { inventoryNumber: 'ASC' },
    });
  }
  async findBySitePaginated(
    siteId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResponse<Equipment>> {
    const [data, total] = await this.equipmentRepository.findAndCount({
      where: { site: { id: siteId } },
      relations: ['maker', 'model', 'currentState'],
      skip: (page - 1) * limit,
      take: limit,
      order: { inventoryNumber: 'ASC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
  async getStateHistory(id: string): Promise<EquipmentStateHistory[]> {
    // Verificar que el equipo existe
    const equipmentExists = await this.equipmentRepository.existsBy({ id });
    if (!equipmentExists) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return this.historyRepository.find({
      where: { equipment: { id } },
      relations: ['state'],
      order: { changedAt: 'DESC' },
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
  async changeEquipmentState(
    equipmentId: string,
    newStateId: string,
    changedBy: string = 'system',
  ): Promise<Equipment> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const equipment = await this.findOne(equipmentId);

      const newState = await this.validateInitialState(
        newStateId,
        transactionalEntityManager,
      );

      equipment.currentState = newState;
      await transactionalEntityManager.save(equipment);

      await transactionalEntityManager.save(EquipmentStateHistory, {
        equipment: { id: equipmentId },
        state: newState,
        changedBy,
        changedAt: new Date(),
      });

      this.logger.log(
        `Estado cambiado para equipo ${equipmentId} a ${newState.name}`,
      );
      return equipment;
    });
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
  private async validateSite(
    siteId: string,
    manager: EntityManager = this.siteRepository.manager,
  ): Promise<Sites> {
    const site = await manager.findOne(Sites, {
      where: { id: siteId },
      relations: ['province'],
    });

    if (!site) {
      throw new NotFoundException(`Sitio con ID ${siteId} no encontrado`);
    }
    return site;
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

  async findByCurrentState(stateId: string): Promise<Equipment[]> {
    return this.equipmentRepository.find({
      where: { currentState: { id: stateId } },
      relations: ['maker', 'model', 'typeEquipement', 'currentState', 'site'],
      order: { inventoryNumber: 'ASC' },
    });
  }
}
