import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ToolkitService } from './toolkit.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { CreateCvDto, UpdateCvDto } from './dto/cv.dto.js';
import { CreateCoverLetterDto, UpdateCoverLetterDto } from './dto/cover-letter.dto.js';
import { UploadDocumentDto } from './dto/document.dto.js';
import { CreateChecklistItemDto, UpdateChecklistItemDto } from './dto/checklist.dto.js';

@ApiTags('Application Toolkit (DIN 5008 & Documents)')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('toolkit')
export class ToolkitController {
  constructor(private readonly toolkitService: ToolkitService) {}

  // ===========================================================================
  // 1. CV VERSIONS (DIN 5008 TABELLARISCHER LEBENSLAUF)
  // ===========================================================================

  @Get('cv')
  @ApiOperation({ summary: 'List all tabellarischer Lebenslauf versions created by the candidate' })
  @ApiResponse({ status: 200, description: 'List of CV versions.' })
  async listCvs(@CurrentUser() user: CurrentUserPayload) {
    return this.toolkitService.listCvs(user.userId);
  }

  @Post('cv')
  @ApiOperation({ summary: 'Create a new vocational-tailored Lebenslauf version' })
  @ApiResponse({ status: 201, description: 'CV created successfully.' })
  async createCv(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateCvDto) {
    return this.toolkitService.createCv(user.userId, dto);
  }

  @Get('cv/:id')
  @ApiOperation({ summary: 'Get single Lebenslauf version by ID' })
  @ApiParam({ name: 'id', description: 'CV Version ID' })
  async getCvById(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.getCvById(user.userId, id);
  }

  @Put('cv/:id')
  @ApiOperation({ summary: 'Update an existing Lebenslauf version' })
  @ApiParam({ name: 'id', description: 'CV Version ID' })
  async updateCv(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCvDto,
  ) {
    return this.toolkitService.updateCv(user.userId, id, dto);
  }

  @Delete('cv/:id')
  @ApiOperation({ summary: 'Delete a Lebenslauf version' })
  @ApiParam({ name: 'id', description: 'CV Version ID' })
  async deleteCv(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.deleteCv(user.userId, id);
  }

  @Patch('cv/:id/primary')
  @ApiOperation({ summary: 'Set a Lebenslauf as the primary default CV for one-click job applications' })
  @ApiParam({ name: 'id', description: 'CV Version ID' })
  async setPrimaryCv(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.setPrimaryCv(user.userId, id);
  }

  @Post('cv/:id/duplicate')
  @ApiOperation({ summary: 'Duplicate an existing CV version for a different vocational specialization' })
  @ApiParam({ name: 'id', description: 'Source CV Version ID' })
  async duplicateCv(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.duplicateCv(user.userId, id);
  }

  @Get('cv/:id/render')
  @ApiOperation({ summary: 'Render DIN 5008 print-ready HTML for the CV' })
  @ApiParam({ name: 'id', description: 'CV Version ID' })
  async renderCvHtml(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    const html = await this.toolkitService.renderCvHtml(user.userId, id);
    return { html };
  }

  // ===========================================================================
  // 2. DIN 5008 ANSCHREIBEN (COVER LETTER)
  // ===========================================================================

  @Get('cover-letters')
  @ApiOperation({ summary: 'List all DIN 5008 cover letters' })
  @ApiResponse({ status: 200, description: 'List of cover letters.' })
  async listCoverLetters(@CurrentUser() user: CurrentUserPayload) {
    return this.toolkitService.listCoverLetters(user.userId);
  }

  @Post('cover-letters')
  @ApiOperation({ summary: 'Create a new DIN 5008 compliant cover letter' })
  @ApiResponse({ status: 201, description: 'Cover letter created successfully.' })
  async createCoverLetter(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCoverLetterDto,
  ) {
    return this.toolkitService.createCoverLetter(user.userId, dto);
  }

  @Get('cover-letters/:id')
  @ApiOperation({ summary: 'Get single cover letter by ID' })
  @ApiParam({ name: 'id', description: 'Cover Letter ID' })
  async getCoverLetterById(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.getCoverLetterById(user.userId, id);
  }

  @Put('cover-letters/:id')
  @ApiOperation({ summary: 'Update an existing cover letter' })
  @ApiParam({ name: 'id', description: 'Cover Letter ID' })
  async updateCoverLetter(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateCoverLetterDto,
  ) {
    return this.toolkitService.updateCoverLetter(user.userId, id, dto);
  }

  @Delete('cover-letters/:id')
  @ApiOperation({ summary: 'Delete a cover letter' })
  @ApiParam({ name: 'id', description: 'Cover Letter ID' })
  async deleteCoverLetter(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.deleteCoverLetter(user.userId, id);
  }

  @Get('cover-letters/:id/render')
  @ApiOperation({ summary: 'Render DIN 5008 compliant print-ready HTML for the cover letter' })
  @ApiParam({ name: 'id', description: 'Cover Letter ID' })
  async renderCoverLetterHtml(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    const html = await this.toolkitService.renderCoverLetterHtml(user.userId, id);
    return { html };
  }

  // ===========================================================================
  // 3. APPLICANT DOCUMENT VAULT
  // ===========================================================================

  @Get('documents')
  @ApiOperation({ summary: 'List uploaded applicant documents, optionally filtered by category' })
  @ApiQuery({ name: 'category', required: false, description: 'Category filter e.g. LANGUAGE_CERTIFICATE' })
  async listDocuments(
    @CurrentUser() user: CurrentUserPayload,
    @Query('category') category?: string,
  ) {
    return this.toolkitService.listDocuments(user.userId, category);
  }

  @Get('documents/stats')
  @ApiOperation({ summary: 'Get summary statistics of document vault (count, storage size, categories)' })
  async getDocumentStats(@CurrentUser() user: CurrentUserPayload) {
    return this.toolkitService.getDocumentStats(user.userId);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Register an uploaded verified document in the applicant vault' })
  @ApiResponse({ status: 201, description: 'Document registered.' })
  async uploadDocument(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.toolkitService.uploadDocument(user.userId, dto);
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Delete a document from the vault' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  async deleteDocument(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.deleteDocument(user.userId, id);
  }

  // ===========================================================================
  // 4. EMBASSY & INTERVIEW READINESS CHECKLIST
  // ===========================================================================

  @Get('checklists')
  @ApiOperation({ summary: 'Get embassy visa & interview readiness checklist with progress metrics' })
  async getChecklist(@CurrentUser() user: CurrentUserPayload) {
    return this.toolkitService.getChecklist(user.userId);
  }

  @Post('checklists')
  @ApiOperation({ summary: 'Add a custom task to the preparation checklist' })
  async createChecklistItem(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateChecklistItemDto,
  ) {
    return this.toolkitService.createChecklistItem(user.userId, dto);
  }

  @Put('checklists/:id')
  @ApiOperation({ summary: 'Update status or details of a checklist task' })
  @ApiParam({ name: 'id', description: 'Checklist Item ID' })
  async updateChecklistItem(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateChecklistItemDto,
  ) {
    return this.toolkitService.updateChecklistItem(user.userId, id, dto);
  }

  @Delete('checklists/:id')
  @ApiOperation({ summary: 'Delete a task from the checklist' })
  @ApiParam({ name: 'id', description: 'Checklist Item ID' })
  async deleteChecklistItem(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.toolkitService.deleteChecklistItem(user.userId, id);
  }

  @Post('checklists/reset')
  @ApiOperation({ summary: 'Reset checklist to standard official German visa & interview template (10 items)' })
  async resetChecklist(@CurrentUser() user: CurrentUserPayload) {
    return this.toolkitService.resetChecklist(user.userId);
  }
}
