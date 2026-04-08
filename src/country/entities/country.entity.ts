import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Maker } from '../../maker/entities/maker.entity';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 45 })
  countryName: string;

  @OneToMany(() => Maker, (maker) => maker.country)
  makers: Maker[];
}
