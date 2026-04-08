import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOperator } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryFiltersDto } from './dto/country-filters.dto';
@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepository.create({
      countryName: createCountryDto.countryName,
    });
    return await this.countryRepository.save(country);
  }

  async findAll(filters?: CountryFiltersDto): Promise<Country[]> {
    const where: { countryName?: FindOperator<string> } = {};

    if (filters?.countryName) {
      where.countryName = Like(`%${filters.countryName}%`);
    }

    return await this.countryRepository.find({
      where,
      relations: ['makers'],
    });
  }
  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ['makers'],
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async update(
    id: string,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.findOne(id);
    Object.assign(country, updateCountryDto);
    return await this.countryRepository.save(country);
  }

  async delete(id: string): Promise<void> {
    const country = await this.findOne(id);
    await this.countryRepository.remove(country);
  }
}
