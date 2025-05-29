import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Country } from '../../country/entities/country.entity';
import { Model } from 'src/model/entities/model.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
@Entity()
export class Maker {
  @PrimaryGeneratedColumn('uuid')
  idMaker: string;

  @Column({ length: 45, nullable: true })
  brand: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => Country, (country) => country.makers)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @OneToMany(() => Model, (model) => model.maker)
  models: Model[];

  @OneToMany(() => Equipment, (equipment) => equipment.maker)
  equipement: Equipment[];
}
