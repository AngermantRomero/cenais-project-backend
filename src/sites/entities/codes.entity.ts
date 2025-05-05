import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Sitio } from './sites.entity';
import { Provincia } from './province.entity';
@Entity()
export class Codigo {
  @PrimaryGeneratedColumn({ name: 'IdCodigo' })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  codigo: string;

  @OneToMany(() => Sitio, (sitio) => sitio.codigo)
  sitios: Sitio[];

  @ManyToOne(() => Provincia, (provincia) => provincia.codigos)
  provincia: Provincia;
}
