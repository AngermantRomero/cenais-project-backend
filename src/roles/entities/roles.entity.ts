import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { RoleName } from '../enums/roles.enum';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único del rol en formato UUID',
  })
  id: string;

  @Column({ type: 'enum', enum: RoleName, unique: true })
  @ApiProperty({ example: RoleName.ADMINISTRATOR, enum: RoleName })
  name: RoleName;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
