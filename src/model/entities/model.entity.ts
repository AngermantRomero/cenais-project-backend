import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Maker } from '../../maker/entities/maker.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';

@Entity('model') // ⬅️ Asegúrate que coincida con tu tabla en BD
export class Model {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID autogenerado',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Modelo X200', description: 'Nombre del modelo' })
  @Column({ length: 100 })
  modelName: string;

  @ApiProperty({
    example: 'Modelo profesional para mediciones sísmicas',
    description: 'Descripción del modelo',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ type: () => Maker, description: 'Fabricante del modelo' })
  @ManyToOne(() => Maker, (maker) => maker.models)
  @JoinColumn({ name: 'makerId' })
  maker: Maker;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del fabricante',
  })
  @Column()
  makerId: string;

  @ApiProperty({
    type: () => [Equipment],
    description: 'Equipos de este modelo',
  })
  @OneToMany(() => Equipment, (equipment) => equipment.model)
  equipments: Equipment[];
}
