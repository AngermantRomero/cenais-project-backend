import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Maker } from './entities/maker.entity';
import { Country } from '../country/entities/country.entity';
import { CreateMakerDto } from './dto/create-maker.dto';
import { UpdateMakerDto } from './dto/update-maker.dto';
import { MakerResponseDto } from './dto/maker.dto';
import { MakerFiltersDto } from './dto/maker-filters.dto';

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
    const maker = await this.findOneInternal(id);

    if (updateMakerDto.countryName) {
      maker.country = await this.handleCountry(updateMakerDto.countryName);
    }

    if (updateMakerDto.brand !== undefined) {
      maker.brand = updateMakerDto.brand.trim();
    }
    if (updateMakerDto.description !== undefined) {
      maker.description = updateMakerDto.description.trim();
    }

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
