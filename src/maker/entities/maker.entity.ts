import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Country } from './country.entity';

@Entity()
export class Maker {
  @PrimaryGeneratedColumn('uuid')
  idMaker: string;

  @Column({ length: 45, nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Country)
  @JoinColumn({ name: 'Country_idCountry' })
  country: Country;
}
