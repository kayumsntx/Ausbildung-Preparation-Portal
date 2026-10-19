import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AdminUpdateUserStatusDto, AdminAssignRoleDto } from './dto/admin-user.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { RoleType, AccountStatus } from '../../common/common.constants.js';

@ApiTags('User Management & Profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Retrieve authenticated user profile, roles, and preferences' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully.' })
  async getMe(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getMe(user.userId);
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update personal profile information' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  // --- Administrative Endpoints (Admin Role Guarded) ---

  @Get()
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Admin directory: list users with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'role', required: false, enum: RoleType })
  @ApiQuery({ name: 'status', required: false, enum: AccountStatus })
  async listUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('role') role?: RoleType,
    @Query('status') status?: AccountStatus,
  ) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.usersService.listUsers(pageNum, limitNum, role, status);
  }

  @Patch(':id/status')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Admin: update user account status (e.g. SUSPEND or ACTIVATE)' })
  async updateUserStatus(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserStatusDto,
    @CurrentUser() admin: CurrentUserPayload,
  ) {
    return this.usersService.updateUserStatus(id, dto.status, admin.userId);
  }

  @Post(':id/roles')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Admin: assign a role to user (e.g. INSTRUCTOR or MODERATOR)' })
  async assignRole(
    @Param('id') id: string,
    @Body() dto: AdminAssignRoleDto,
    @CurrentUser() admin: CurrentUserPayload,
  ) {
    return this.usersService.assignRole(id, dto.role, admin.userId);
  }

  @Delete(':id/roles/:role')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Admin: remove a role from user' })
  async removeRole(
    @Param('id') id: string,
    @Param('role') role: RoleType,
    @CurrentUser() admin: CurrentUserPayload,
  ) {
    return this.usersService.removeRole(id, role, admin.userId);
  }
}
