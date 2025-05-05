import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Provincia } from './province.entity';
import { Codigo } from './codes.entity';

@Entity()
export class Sitio {
  @PrimaryGeneratedColumn({ name: 'IdSitio' })
  id: number;

  @Column({ type: 'varchar', length: 45 })
  localidad: string;

  @ManyToOne(() => Provincia, (provincia) => provincia.sitios)
  @JoinColumn({ name: 'Provincias_idProvincia' })
  provincia: Provincia;

  @ManyToOne(() => Codigo, (codigo) => codigo.sitios)
  @JoinColumn({ name: 'Codigos_idCodigo' })
  codigo: Codigo;
}
