import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
  })
  phone?: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: false,
  })
  roleId: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;
}
