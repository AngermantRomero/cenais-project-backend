import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sites } from '../../sites/entities/sites.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Sites, (site) => site.province)
  sites: Sites[];
}
