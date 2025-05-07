import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { Equipo } from './entities/equipement.entity';
import { CreateEquipoDto } from './dto/create-equipement.dto';

@Injectable()
export class EquiposService {
  constructor(
    @InjectRepository(Equipo)
    private equiposRepository: Repository<Equipo>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    if (!createEquipoDto.serialNumber || !createEquipoDto.inventoryNumber) {
      throw new Error('Serial number e inventory number son requeridos');
    }

    const nuevoEquipo = this.equiposRepository.create(createEquipoDto);

    return await this.equiposRepository.save(nuevoEquipo);
  }

  async findAll(): Promise<Equipo[]> {
    return await this.equiposRepository.find();
  }

  async findOne(id: string): Promise<Equipo> {
    const equipo = await this.equiposRepository.findOneBy({ idEquipo: id });
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }
    return equipo;
  }
  async findByDate(date: string): Promise<Equipo[]> {
    return await this.equiposRepository.find({
      where: {
        StartOfOperation: Raw((alias) => `${alias} = '${date}'`),
      },
    });
  }

  async update(id: string, updateData: Partial<Equipo>): Promise<Equipo> {
    await this.equiposRepository.update(id, updateData);
    const updatedEquipo = await this.equiposRepository.findOneBy({
      idEquipo: id,
    });
    if (!updatedEquipo) {
      throw new NotFoundException(
        `Equipo con ID ${id} no encontrado después de actualizar`,
      );
    }
    return updatedEquipo;
  }

  async remove(id: string): Promise<void> {
    const result = await this.equiposRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Equipo con ID ${id} no existe`);
    }
  }
}
