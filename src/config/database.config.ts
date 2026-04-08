import { DataSourceOptions } from 'typeorm';
import { Province } from 'src/provinces/entities/province.entity';
import { Role } from 'src/roles/entities/roles.entity';
import { Sites } from 'src/sites/entities/sites.entity';
import { User } from 'src/users/entities/user.entity';
import { TypeState } from 'src/type-state/entities/type-state.entity';
import { Equipment } from 'src/equipments/entities/equipment.entity';
import { Maker } from 'src/maker/entities/maker.entity';
import { Country } from 'src/country/entities/country.entity';
import { Model } from 'src/model/entities/model.entity';
import { TypeEquipement } from 'src/type-equipement/entities/type-equipement.entity';
import { EquipmentStateHistory } from 'src/equipment-state-history/entities/equipement-state-history.entity';

export const databaseConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [
    Province,
    Role,
    Sites,
    User,
    TypeState,
    Equipment,
    Maker,
    Country,
    Model,
    TypeEquipement,
    EquipmentStateHistory,
  ],
  synchronize: false,
};
