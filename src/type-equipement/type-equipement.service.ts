import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeEquipement } from './entities/type-equipement.entity';
import { CreateTypeEquipementDto } from './dto/create-typeEquipement.dto';
import { UpdateTypeEquipementDto } from './dto/update-typeEquipement.dto';
import { TypeEquipementFilterDto } from './dto/type-equipement-filter.dto';
import { UUID } from 'crypto';
@Injectable()
export class TypeEquipementService {
  constructor(
    @InjectRepository(TypeEquipement)
    private readonly typeEquipementRepository: Repository<TypeEquipement>,
  ) {}

  // Crear un nuevo tipo de equipo
  async create(
    createTypeEquipementDto: CreateTypeEquipementDto,
  ): Promise<TypeEquipement> {
    // 1. Verificar si ya existe un tipo con la misma descripción
    const existingType = await this.typeEquipementRepository.findOne({
      where: { description: createTypeEquipementDto.description.trim() },
    });

    if (existingType) {
      throw new ConflictException(
        'Ya existe un tipo de equipamiento con esta descripción',
      );
    }

    // 2. Crear la nueva entidad
    const newTypeEquipement = this.typeEquipementRepository.create({
      description: createTypeEquipementDto.description.trim(),
    });

    try {
      // 3. Guardar en la base de datos
      return await this.typeEquipementRepository.save(newTypeEquipement);
    } catch (error) {
      // Manejo específico de error de duplicado (PostgreSQL)
      if (error.code === '23505') {
        throw new ConflictException('El tipo de equipamiento ya existe');
      }

      // Otros errores de base de datos
      throw new InternalServerErrorException(
        'Error al crear el tipo de equipamiento',
      );
    }
  }

  // Obtener todos los tipos de equipo
  async findAll(): Promise<TypeEquipement[]> {
    return await this.typeEquipementRepository.find();
  }

  // Obtener un tipo de equipo por ID
  async findOne(id: UUID): Promise<TypeEquipement> {
    const typeEquipement = await this.typeEquipementRepository.findOne({
      where: { id },
    });
    if (!typeEquipement) {
      throw new NotFoundException(`TypeEquipement with ID ${id} not found`);
    }
    return typeEquipement;
  }

  async filter(filters: TypeEquipementFilterDto): Promise<TypeEquipement[]> {
    const query =
      this.typeEquipementRepository.createQueryBuilder('typeEquipement');

    if (filters.id) {
      query.andWhere('typeEquipement.id = :id', { id: filters.id });
    }

    if (filters.description) {
      query.andWhere('typeEquipement.description LIKE :description', {
        description: `%${filters.description}%`, // Búsqueda parcial
      });
    }

    return query.getMany();
  }
  // Actualizar un tipo de equipo
  async update(
    id: UUID,
    updateTypeEquipementDto: UpdateTypeEquipementDto,
  ): Promise<TypeEquipement> {
    const typeEquipement = await this.findOne(id); // Reutiliza el método findOne para validar existencia
    this.typeEquipementRepository.merge(
      typeEquipement,
      updateTypeEquipementDto,
    );
    return await this.typeEquipementRepository.save(typeEquipement);
  }

  // Eliminar un tipo de equipo
  async remove(id: UUID): Promise<void> {
    const typeEquipement = await this.findOne(id); // Valida que exista
    await this.typeEquipementRepository.remove(typeEquipement);
  }
}
