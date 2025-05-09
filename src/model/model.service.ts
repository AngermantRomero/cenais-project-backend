import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ModelDto } from './dto/model.dto';
import { ModelFiltersDto } from './dto/model-filtres.dto';
import { Maker } from '../maker/entities/maker.entity';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Maker)
    private readonly makerRepository: Repository<Maker>,
  ) {}

  async create(createModelDto: CreateModelDto): Promise<ModelDto> {
    const maker = await this.validateMaker(createModelDto.makerId);

    const model = this.modelRepository.create({
      modelName: createModelDto.modelName,
      description: createModelDto.description,
      maker,
    });

    const savedModel = await this.modelRepository.save(model);
    return this.toDto(savedModel);
  }

  async findAll(filters?: ModelFiltersDto): Promise<ModelDto[]> {
    const query = this.modelRepository
      .createQueryBuilder('model')
      .leftJoinAndSelect('model.maker', 'maker');

    if (filters?.modelName) {
      query.andWhere('model.modelName LIKE :modelName', {
        modelName: `%${filters.modelName}%`,
      });
    }

    if (filters?.description) {
      query.andWhere('model.description LIKE :description', {
        description: `%${filters.description}%`,
      });
    }

    if (filters?.makerId) {
      query.andWhere('maker.idMaker = :makerId', {
        makerId: filters.makerId,
      });
    }

    const models = await query.getMany();
    return models.map((model) => this.toDto(model));
  }
  async findOne(id: string): Promise<ModelDto> {
    const model = await this.modelRepository.findOne({
      where: { id },
      relations: ['maker'],
    });

    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }

    return this.toDto(model);
  }

  async update(id: string, updateModelDto: UpdateModelDto): Promise<ModelDto> {
    const model = await this.findOne(id);
    const updates: Partial<Model> = {};

    if (updateModelDto.modelName) {
      updates.modelName = updateModelDto.modelName;
    }

    if (updateModelDto.description) {
      updates.description = updateModelDto.description;
    }

    if (updateModelDto.makerId) {
      const maker = await this.validateMaker(updateModelDto.makerId);
      updates.maker = maker;
      updates.makerId = updateModelDto.makerId;
    }

    Object.assign(model, updates);
    const updatedModel = await this.modelRepository.save(model);
    return this.toDto(updatedModel);
  }

  async delete(id: string): Promise<void> {
    const model = await this.modelRepository.findOneBy({ id });

    if (!model) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }

    await this.modelRepository.remove(model);
  }

  private async validateMaker(makerId: string): Promise<Maker> {
    const maker = await this.makerRepository.findOne({
      where: { idMaker: makerId },
    });

    if (!maker) {
      throw new NotFoundException(`Maker with ID ${makerId} not found`);
    }

    return maker;
  }

  private toDto(model: Model): ModelDto {
    return {
      id: model.id,
      modelName: model.modelName,
      description: model.description,
      makerId: model.maker?.idMaker,
      makerBrand: model.maker?.brand,
    };
  }
}
