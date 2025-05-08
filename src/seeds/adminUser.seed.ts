import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/roles.entity';
import * as bcrypt from 'bcrypt';
import { RoleName } from 'src/roles/enums/roles.enum';

export async function seedAdminUser(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const roleRepo = dataSource.getRepository(Role);

  const existingUser = await userRepo.findOneBy({ email: 'admin@test.com' });
  if (existingUser) return;

  const adminRole = await roleRepo.findOneBy({ name: RoleName.ADMINISTRATOR });
  if (!adminRole) {
    throw new Error('El rol "Administrator" no existe');
  }

  const hashedPassword = await bcrypt.hash('admin123!', 10);

  const user = userRepo.create({
    name: 'Admin',
    lastName: 'Test',
    email: 'admin@test.com',
    password: hashedPassword,
    role: adminRole,
    isActive: true,
  });

  await userRepo.save(user);
  console.log('✅ Usuario admin@test.com creado');
}
