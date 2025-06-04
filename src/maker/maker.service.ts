import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, FindOptionsWhere } from 'typeorm';
import { Maker } from './entities/maker.entity';
import { Country } from '../country/entities/country.entity';
import { CreateMakerDto } from './dto/create-maker.dto';
import { UpdateMakerDto } from './dto/update-maker.dto';
import { MakerResponseDto } from './dto/maker.dto';
import { MakerFiltersDto } from './dto/maker-filters.dto';
import { validate } from 'class-validator';

@Injectable()
export class MakerService {
  constructor(
    @InjectRepository(Maker)
    private makerRepository: Repository<Maker>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async create(createMakerDto: CreateMakerDto): Promise<MakerResponseDto> {
    const country = await this.handleCountry(createMakerDto.countryName);

    const maker = this.makerRepository.create({
      brand: createMakerDto.brand.trim(),
      description: createMakerDto.description.trim(),
      country,
    });

    const savedMaker = await this.makerRepository.save(maker);
    return this.toResponseDto(savedMaker);
  }

  private async handleCountry(countryName: string): Promise<Country> {
    const normalizedName = countryName.trim().toLowerCase();
    let country = await this.countryRepository.findOne({
      where: { countryName: ILike(`%${normalizedName}%`) },
    });

    if (!country) {
      country = this.countryRepository.create({
        countryName: countryName.trim(),
      });
      country = await this.countryRepository.save(country);
    }
    return country;
  }
  async findAll(filters?: MakerFiltersDto): Promise<MakerResponseDto[]> {
    const query = this.makerRepository
      .createQueryBuilder('maker')
      .leftJoinAndSelect('maker.country', 'country');

    if (filters?.brand) {
      query.andWhere('maker.brand LIKE :brand', {
        brand: `%${filters.brand}%`,
      });
    }

    if (filters?.countryId) {
      query.andWhere('country.id = :countryId', {
        countryId: filters.countryId,
      });
    }

    const makers = await query.getMany();

    return makers.map((maker) => this.toResponseDto(maker));
  }

  async findOne(id: string): Promise<MakerResponseDto> {
    const maker = await this.makerRepository.findOne({
      where: { idMaker: id },
      relations: ['country'],
    });

    if (!maker) {
      throw new NotFoundException(`Maker with ID ${id} not found`);
    }

    return this.toResponseDto(maker);
  }

  async update(
    id: string,
    updateMakerDto: UpdateMakerDto,
  ): Promise<MakerResponseDto> {
    // Validación básica del ID
    if (!id || typeof id !== 'string') {
      throw new BadRequestException('ID de fabricante no válido');
    }

    // Validar que al menos un campo sea proporcionado
    if (Object.keys(updateMakerDto).length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos para actualizar',
      );
    }

    // Buscar el fabricante
    const maker = await this.makerRepository.findOne({
      where: { idMaker: id },
      relations: ['country'],
    });

    if (!maker) {
      throw new NotFoundException(`Fabricante con ID ${id} no encontrado`);
    }

    // Aplicar actualizaciones solo si vienen en el DTO
    if (updateMakerDto.brand !== undefined) {
      maker.brand = updateMakerDto.brand.trim();
    }

    if (updateMakerDto.description !== undefined) {
      maker.description = updateMakerDto.description.trim();
    }

    if (updateMakerDto.countryName !== undefined) {
      maker.country = await this.handleCountry(updateMakerDto.countryName);
    }

    // Guardar cambios
    const updatedMaker = await this.makerRepository.save(maker);
    return this.toResponseDto(updatedMaker);
  }
  async delete(id: string): Promise<void> {
    const result = await this.makerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Maker with ID ${id} not found`);
    }
  }

  private async findOneInternal(id: string): Promise<Maker> {
    const maker = await this.makerRepository.findOne({
      where: { idMaker: id },
      relations: ['country'],
    });

    if (!maker) {
      throw new NotFoundException(`Maker with ID ${id} not found`);
    }

    return maker;
  }

  private async validateCountry(countryId: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id: countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    return country;
  }

  private toResponseDto(maker: Maker): MakerResponseDto {
    return {
      idMaker: maker.idMaker,
      brand: maker.brand,
      description: maker.description,
      country: {
        id: maker.country.id,
        countryName: maker.country.countryName,
      },
    };
  }
}
