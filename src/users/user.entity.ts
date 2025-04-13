import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn({ name: 'idUsuario' })
  id: number;

  @Column({ name: 'Nombre', length: 45, nullable: false })
  name: string;
  @Column({ name: 'Apellido', length: 45, nullable: false })
  lastname: string;
  @Column({ name: 'phone', length: 45, nullable: true })
  phone?: string;
  @Column({ name: 'correo', length: 45, nullable: true })
  email: string;
  @Column({ name: 'Roles_idRole', nullable: false })
  rolId: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'password', length: 45, nullable: false })
  password: string;
}
