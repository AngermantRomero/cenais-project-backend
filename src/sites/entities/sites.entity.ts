import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Province } from 'src/provinces/entities/province.entity';

@Entity('sites')
export class Sites {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'ID único generado automáticamente (UUID)',
  })
  id: string;

  @ApiProperty({
    example: 'Manicaragua',
    description: 'Nombre de la localidad del sitio',
  })
  @Column({ type: 'varchar', length: 45 })
  locality: string;

  @ApiProperty({
    example: 'MGV',
    description: 'Codigo del sitio',
  })
  @Column({ type: 'varchar', length: 45 })
  code: string;

  @ApiProperty({
    example: 'MGV',
    description: '',
  })
  @ManyToOne(() => Province, (province) => province.sites)
  @JoinColumn({ name: 'province_id' })
  province: Province;
}
