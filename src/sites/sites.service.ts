import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sitio } from './entities/sites.entity';
import { CreateSitioDto } from './dto/create-sites.dto';
import { UpdateSitioDto } from './dto/update-sites.dto';
import { Provincia } from './entities/province.entity';
import { Codigo } from './entities/codes.entity';

@Injectable()
export class SitiosService {
  constructor(
    @InjectRepository(Sitio)
    private sitioRepository: Repository<Sitio>,
    @InjectRepository(Provincia)
    private provinciaRepository: Repository<Provincia>,
    @InjectRepository(Codigo)
    private codigoRepository: Repository<Codigo>,
  ) {}

  async create(createSitioDto: CreateSitioDto): Promise<Sitio> {
    const provincia = await this.provinciaRepository.findOneBy({
      id: createSitioDto.idProvincia,
    });
    const codigo = await this.codigoRepository.findOneBy({
      id: createSitioDto.Codigo,
    });
    if (!provincia || !codigo) {
      throw new NotFoundException('Provincia o Código no encontrado');
    }
    const sitio = this.sitioRepository.create(createSitioDto);
    return this.sitioRepository.save(sitio);
  }

  async findAll(): Promise<Sitio[]> {
    return this.sitioRepository.find({
      relations: ['provincia', 'codigo'],
    });
  }

  async findOne(id: number): Promise<Sitio> {
    return this.sitioRepository.findOneOrFail({
      where: { id },
      relations: ['provincia', 'codigo'],
    });
  }

  async update(id: number, updateSitioDto: UpdateSitioDto): Promise<Sitio> {
    await this.sitioRepository.update(id, updateSitioDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.sitioRepository.delete(id);
  }
}
