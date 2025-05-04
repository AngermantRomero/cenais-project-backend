import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/roles.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único generado automáticamente (UUID)',
  })
  id: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
    maxLength: 45,
  })
  name: string;

  @Column({ type: 'varchar', length: 45, nullable: false })
  @ApiProperty({
    example: 'Pérez',
    description: 'Apellido del usuario',
    maxLength: 45,
  })
  lastName: string;

  @Column({ type: 'varchar', length: 45, nullable: true })
  @ApiProperty({
    example: '+56912345678',
    description: 'Teléfono del usuario (opcional)',
    maxLength: 45,
    required: false,
  })
  phone?: string;

  @Column({ type: 'varchar', length: 45, nullable: false, unique: true })
  @ApiProperty({
    example: 'juan.perez@example.com',
    description: 'Email único del usuario',
    maxLength: 45,
  })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({
    example: 'PasswordSeguro123!',
    description: 'Contraseña encriptada',
    maxLength: 255,
  })
  password: string;

  @ManyToOne(() => Role, { eager: true, nullable: false })
  @JoinColumn()
  @ApiProperty({ type: () => Role, description: 'Role asignado al usuario' })
  role: Role;

  @Column({ type: 'boolean', default: true })
  @ApiProperty({
    example: true,
    description: 'Indica si el usuario está activo',
    default: true,
  })
  isActive: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-10-25T12:00:00Z',
    description: 'Fecha de creación del usuario',
  })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({
    example: '2023-10-25T12:00:00Z',
    description: 'Fecha de última actualización',
  })
  updateAt: Date;
}
