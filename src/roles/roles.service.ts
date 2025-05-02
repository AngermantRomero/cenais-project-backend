import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(`El role ${createRoleDto.name} ya existe`);
    }

    const role = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: id },
    });
    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }
    return role;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Si intenta cambiar el nombre a uno ya existente
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const nameExists = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (nameExists) {
        throw new ConflictException(
          `Ya existe un role con el nombre ${updateRoleDto.name}`,
        );
      }
    }

    Object.assign(role, updateRoleDto);
    return this.roleRepository.save(role);
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    const usersCount = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'user')
      .where('role.id = :id', { id })
      .getCount();

    if (usersCount > 0) {
      throw new BadRequestException(
        'No se puede eliminar el role porque está asignado a uno o más usuarios',
      );
    }

    await this.roleRepository.remove(role);
  }
}
