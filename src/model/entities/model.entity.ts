import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Maker } from '../../maker/entities/maker.entity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  modelName: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Maker, (maker) => maker.models)
  @JoinColumn({ name: 'makerId' })
  maker: Maker;

  @Column()
  makerId: string;
}
