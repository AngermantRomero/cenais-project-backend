import { IsEnum } from 'class-validator';
import { RoleName } from '../enums/roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsEnum(RoleName)
  @ApiProperty({ enum: RoleName, example: RoleName.ADMINISTRATOR })
  name: RoleName;
}
