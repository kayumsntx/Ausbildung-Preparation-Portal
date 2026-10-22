import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { type Request } from 'express';
import { DashboardService } from './dashboard.service.js';
import { ResolveReportDto } from './dto/resolve-report.dto.js';
import { AuditQueryDto } from './dto/audit-query.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { RoleType } from '../../common/common.constants.js';

@ApiTags('Unified Dashboards & Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('student')
  @Roles(RoleType.STUDENT, RoleType.ADMIN)
  @ApiOperation({ summary: 'Candidate progress hub: aggregate German learning, jobs, courses, speaking & coins' })
  @ApiResponse({ status: 200, description: 'Aggregated student progress metrics retrieved successfully.' })
  async getStudentDashboard(@CurrentUser() user: CurrentUserPayload) {
    return this.dashboardService.getStudentDashboard(user.userId);
  }

  @Get('admin/overview')
  @Roles(RoleType.ADMIN, RoleType.MODERATOR)
  @ApiOperation({ summary: 'Admin overview: global platform KPIs, active users, course enrollments, coin economy' })
  @ApiResponse({ status: 200, description: 'Platform overview metrics retrieved successfully.' })
  async getAdminOverview() {
    return this.dashboardService.getAdminOverview();
  }

  @Get('admin/moderation')
  @Roles(RoleType.ADMIN, RoleType.MODERATOR)
  @ApiOperation({ summary: 'Moderation queue: list reported speaking sessions and incidents' })
  @ApiQuery({ name: 'isResolved', required: false, type: Boolean })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getModerationQueue(
    @Query('isResolved') isResolved?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    const resolvedBool = isResolved === 'true';
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    return this.dashboardService.getModerationQueue(resolvedBool, pageNum, limitNum);
  }

  @Patch('admin/moderation/:id/resolve')
  @Roles(RoleType.ADMIN, RoleType.MODERATOR)
  @ApiOperation({ summary: 'Resolve speaking moderation report and apply disciplinary actions' })
  async resolveModerationReport(
    @Param('id') id: string,
    @Body() dto: ResolveReportDto,
    @CurrentUser() admin: CurrentUserPayload,
    @Req() req: Request,
  ) {
    const ipAddress = req.ip || (req.headers['x-forwarded-for'] as string) || undefined;
    return this.dashboardService.resolveModerationReport(id, dto, admin.userId, ipAddress);
  }

  @Get('admin/audit-logs')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Audit logs: paginated, filterable immutable administrative security logs' })
  async getAuditLogs(@Query() query: AuditQueryDto) {
    return this.dashboardService.getAuditLogs(query);
  }

  @Get('admin/health')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'System health: real-time database latency, memory footprint, uptime & subsystem probes' })
  async getSystemHealth() {
    return this.dashboardService.getSystemHealth();
  }
}
