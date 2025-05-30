import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Equipment } from 'src/equipments/entities/equipment.entity';

@Entity('TypeEquipement')
export class TypeEquipement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'Descripcion', length: 45 })
  description: string;

  @OneToMany(() => Equipment, (equipement) => equipement.typeEquipement)
  equipement: Equipment[];
}
