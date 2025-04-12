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
  @Column({ nullable: true })
  phone: string;
  @Column({ unique: true })
  role: number;
  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column()
  password: string;
}
