import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  idCountry: string;

  @Column({ length: 45 })
  country: string;
}
