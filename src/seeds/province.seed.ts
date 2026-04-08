import { DataSource } from 'typeorm';
import { Province } from 'src/provinces/entities/province.entity';

const provinces = [
  { name: 'Pinar del Río' },
  { name: 'Artemisa' },
  { name: 'La Habana' },
  { name: 'Mayabeque' },
  { name: 'Matanzas' },
  { name: 'Cienfuegos' },
  { name: 'Villa Clara' },
  { name: 'Sancti Spíritus' },
  { name: 'Ciego de Ávila' },
  { name: 'Camagüey' },
  { name: 'Las Tunas' },
  { name: 'Holguín' },
  { name: 'Granma' },
  { name: 'Santiago de Cuba' },
  { name: 'Guantánamo' },
  { name: 'Isla de la Juventud' },
];

export async function seedProvinces(dataSource: DataSource) {
  const repo = dataSource.getRepository(Province);
  for (const province of provinces) {
    const exists = await repo.findOneBy({ name: province.name });
    if (!exists) {
      await repo.save(repo.create(province));
      console.log('✅ Provincia creada', province.name);
    }
  }
}
