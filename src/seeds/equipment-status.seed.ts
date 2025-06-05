import { DataSource } from 'typeorm';
import { EquipmentStatus } from 'src/type-state/enums/equipments-status.enum';
import { TypeState } from 'src/type-state/entities/type-state.entity';

const equipmentStatus = [
  { name: EquipmentStatus.OPERATIONAL },
  { name: EquipmentStatus.UNDER_REPAIR },
  { name: EquipmentStatus.DAMAGED },
];

export async function seedEquipmentStatus(dataSource: DataSource) {
  const repo = dataSource.getRepository(TypeState);

  for (const status of equipmentStatus) {
    const exists = await repo.findOneBy({ name: status.name });
    if (!exists) {
      await repo.save(repo.create(status));
      console.log('✅ Estado creado', status.name);
    }
  }
}
