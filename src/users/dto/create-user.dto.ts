export class CreateUserDto {
  id: number;
  userName: string;
  lastName: string;
  email: string;
  phone: number;
  roles_idRole: number;
  createdAt: Date;
  passsword: string;
}
