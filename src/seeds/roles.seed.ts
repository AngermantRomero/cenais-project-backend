import { DataSource } from 'typeorm';
import { Role } from 'src/roles/entities/roles.entity';
import { RoleName } from 'src/roles/enums/roles.enum';

const roles = [
  { name: RoleName.ADMINISTRATOR },
  { name: RoleName.TECHNICIAN },
  { name: RoleName.GUEST },
];

export async function seedRoles(dataSource: DataSource) {
  const repo = dataSource.getRepository(Role);

  for (const role of roles) {
    const exists = await repo.findOneBy({ name: role.name });
    if (!exists) {
      await repo.save(repo.create(role));
      console.log('✅ Role creado', role.name);
    }
  }
}
