import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Codigo } from './codes.entity';
import { Sitio } from './sites.entity';

@Entity()
export class Provincia {
  @PrimaryGeneratedColumn({ name: 'idProvincia' })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  provincia: string;

  @OneToMany(() => Codigo, (codigo) => codigo.provincia)
  codigos: Codigo[];

  @OneToMany(() => Sitio, (sitio) => sitio.provincia)
  sitios: Sitio[];
}
