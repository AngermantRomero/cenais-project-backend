import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  userName: string;
  @Column()
  lastName: string;
  @Column({ unique: true })
  email: string;
  @Column()
  phone: number;
  @Column({ unique: true })
  roles_idRole: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column()
  passsword: string;
}
