import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeState } from './entities/type-state.entity';
import { CreateTypeStateDto, UpdateTypeStateDto } from './dto/type-state.dto';

@Injectable()
export class TypeStateService {
  constructor(
    @InjectRepository(TypeState)
    private readonly typeStateRepository: Repository<TypeState>,
  ) {}

  async create(createDto: CreateTypeStateDto): Promise<TypeState> {
    const typeState = this.typeStateRepository.create(createDto);
    return await this.typeStateRepository.save(typeState);
  }

  async findAll(): Promise<TypeState[]> {
    return await this.typeStateRepository.find();
  }

  async findOne(id: string): Promise<TypeState> {
    const typeState = await this.typeStateRepository.findOneBy({ id });
    if (!typeState) {
      throw new NotFoundException(`TypeState with ID ${id} not found`);
    }
    return typeState;
  }

  async update(id: string, updateDto: UpdateTypeStateDto): Promise<TypeState> {
    const typeState = await this.findOne(id);
    this.typeStateRepository.merge(typeState, updateDto);
    return await this.typeStateRepository.save(typeState);
  }

  async remove(id: string): Promise<void> {
    const typeState = await this.findOne(id);
    await this.typeStateRepository.remove(typeState);
  }
}
