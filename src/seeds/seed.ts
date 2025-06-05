import 'dotenv/config';
import { DataSource } from 'typeorm';
import { databaseConfig } from '../config/database.config';
import { seedProvinces } from './province.seed';
import { seedRoles } from './roles.seed';
import { seedAdminUser } from './adminUser.seed';
import { seedEquipmentStatus } from './equipment-status.seed';

async function runSeed() {
  const dataSource = new DataSource(databaseConfig);
  await dataSource.initialize();
  console.log('Base de datos conectada');

  await seedProvinces(dataSource);
  await seedRoles(dataSource);
  await seedAdminUser(dataSource);
  await seedEquipmentStatus(dataSource);

  console.log('🌱 Seeding completado');
  await dataSource.destroy();
}

runSeed().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
