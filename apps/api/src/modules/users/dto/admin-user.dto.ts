import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleType, AccountStatus } from '../../../common/common.constants.js';

export class AdminUpdateUserStatusDto {
  @ApiProperty({ enum: AccountStatus, example: AccountStatus.SUSPENDED })
  @IsEnum(AccountStatus)
  @IsNotEmpty()
  status!: AccountStatus;
}

export class AdminAssignRoleDto {
  @ApiProperty({ enum: RoleType, example: RoleType.INSTRUCTOR })
  @IsEnum(RoleType)
  @IsNotEmpty()
  role!: RoleType;
}
