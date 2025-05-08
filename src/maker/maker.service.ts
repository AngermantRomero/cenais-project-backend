import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Maker } from './entities/maker.entity';
import { Country } from './entities/country.entity';
import { CreateMakerDto } from './dto/create-maker.dto';
import { UpdateMakerDto } from './dto/update-maker.dto';
import { MakerResponseDto } from './dto/maker.dto';

@Injectable()
export class MakerService {
  constructor(
    @InjectRepository(Maker)
    private makerRepository: Repository<Maker>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  async create(createMakerDto: CreateMakerDto): Promise<Maker> {
    const normalizedCountryName = createMakerDto.countryName
      .trim()
      .toLowerCase();
    let country = await this.countryRepository.findOne({
      where: {
        country: ILike(`%${normalizedCountryName}%`),
      },
    });
    if (!country) {
      country = this.countryRepository.create({
        country: createMakerDto.countryName.trim(),
      });
      country = await this.countryRepository.save(country);
    }

    const maker = this.makerRepository.create({
      brand: createMakerDto.brand?.trim(),
      description: createMakerDto.description?.trim(),
      country: { idCountry: country.idCountry },
    });

    return this.makerRepository.save(maker);
  }

  async findAll(): Promise<MakerResponseDto[]> {
    const makers = await this.makerRepository.find({
      relations: ['country'],
    });
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
      const normalizedCountryName = updateMakerDto.countryName
        .trim()
        .toLowerCase();

      let country = await this.countryRepository.findOne({
        where: { country: ILike(normalizedCountryName) },
      });

      if (!country) {
        country = this.countryRepository.create({
          country: updateMakerDto.countryName.trim(),
        });
        country = await this.countryRepository.save(country);
      }

      maker.country = country;
    }

    if (updateMakerDto.brand !== undefined) {
      maker.brand = updateMakerDto.brand?.trim();
    }

    if (updateMakerDto.description !== undefined) {
      maker.description = updateMakerDto.description?.trim();
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
      where: { idCountry: countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${countryId} not found`);
    }

    return country; // Debe retornar la entidad Country, no el ID
  }

  private toResponseDto(maker: Maker): MakerResponseDto {
    return {
      idMaker: maker.idMaker,
      brand: maker.brand,
      description: maker.description,
      country: {
        idCountry: maker.country.idCountry,
        country: maker.country.country,
      },
    };
  }
}
