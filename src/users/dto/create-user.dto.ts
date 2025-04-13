export class CreateUserDto {
  id: number;
  userName: string;
  lastName: string;
  email: string;
  phone: string;
  role: number;
  createdAt: Date;
  passsword: string;
}
