import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Equipment } from 'src/equipments/entities/equipment.entity';

@Entity('type_equipement')
export class TypeEquipement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'Descripcion', length: 45 })
  name: string;

  @OneToMany(() => Equipment, (equipment) => equipment.typeEquipement)
  equipement: Equipment[];
}
