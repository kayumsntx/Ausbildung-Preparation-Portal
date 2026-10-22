import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class PersonalInfoItem {
  @ApiProperty({ example: 'Mustermann, Max' })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiProperty({ example: '15.04.2001' })
  @IsNotEmpty()
  @IsString()
  birthDate!: string;

  @ApiProperty({ example: 'Dhaka, Bangladesch' })
  @IsNotEmpty()
  @IsString()
  birthPlace!: string;

  @ApiProperty({ example: 'Bangladeschisch' })
  @IsNotEmpty()
  @IsString()
  nationality!: string;

  @ApiProperty({ example: 'House 12, Road 4, Dhanmondi, 1205 Dhaka' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ example: '+880 1712 345678' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'max.mustermann@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' })
  @IsOptional()
  @IsString()
  photoUrl?: string;
}

export class EducationItem {
  @ApiProperty({ example: '09/2019' })
  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @ApiProperty({ example: '06/2023' })
  @IsNotEmpty()
  @IsString()
  endDate!: string;

  @ApiProperty({ example: 'Dhaka Residential Model College' })
  @IsNotEmpty()
  @IsString()
  institution!: string;

  @ApiProperty({ example: 'Higher Secondary Certificate (HSC) - Naturwissenschaften (GPA 5.0/5.0)' })
  @IsNotEmpty()
  @IsString()
  degree!: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Bangladesch' })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiPropertyOptional({ example: 'Schwerpunkte: Biologie, Chemie, Physik, Mathematik' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class ExperienceItem {
  @ApiProperty({ example: '07/2023' })
  @IsNotEmpty()
  @IsString()
  startDate!: string;

  @ApiProperty({ example: '08/2024' })
  @IsNotEmpty()
  @IsString()
  endDate!: string;

  @ApiProperty({ example: 'Dhaka Community Hospital' })
  @IsNotEmpty()
  @IsString()
  company!: string;

  @ApiProperty({ example: 'Praktikant im Pflegedienst / Krankenpflege' })
  @IsNotEmpty()
  @IsString()
  role!: string;

  @ApiProperty({ example: 'Dhaka' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiProperty({ example: 'Bangladesch' })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @ApiProperty({
    example: [
      'Unterstützung bei der Grundpflege von Patientinnen und Patienten',
      'Messung und Dokumentation von Vitalzeichen (Blutdruck, Puls, Blutzucker)',
      'Begleitung von Visiten und Patiententransport',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  tasks!: string[];
}

export class LanguageSkillItem {
  @ApiProperty({ example: 'Deutsch' })
  @IsNotEmpty()
  @IsString()
  language!: string;

  @ApiProperty({ example: 'B2 (Fließend in Wort und Schrift)' })
  @IsNotEmpty()
  @IsString()
  level!: string;

  @ApiPropertyOptional({ example: 'Goethe-Zertifikat B2 (Bestanden mit 88/100)' })
  @IsOptional()
  @IsString()
  certificate?: string;

  @ApiPropertyOptional({ example: 'Sichere Kommunikation im pflegerischen Berufsalltag' })
  @IsOptional()
  @IsString()
  description?: string;
}

export class SkillCategoryItem {
  @ApiProperty({ example: 'EDV & Digitale Kompetenzen' })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({
    example: ['MS Office (Word, Excel, PowerPoint)', 'Krankenhaus-Informationssysteme (Grundkenntnisse)'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  items!: string[];
}

export class CreateCvDto {
  @ApiProperty({ example: 'Pflegefachmann CV - Charité Berlin' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'Pflegefachmann / Pflegefachfrau' })
  @IsNotEmpty()
  @IsString()
  targetVocation!: string;

  @ApiProperty({ type: PersonalInfoItem })
  @ValidateNested()
  @Type(() => PersonalInfoItem)
  personalInfo!: PersonalInfoItem;

  @ApiProperty({ type: [EducationItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItem)
  education!: EducationItem[];

  @ApiProperty({ type: [ExperienceItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItem)
  experience!: ExperienceItem[];

  @ApiProperty({ type: [LanguageSkillItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageSkillItem)
  languageSkills!: LanguageSkillItem[];

  @ApiProperty({ type: [SkillCategoryItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillCategoryItem)
  skills!: SkillCategoryItem[];

  @ApiPropertyOptional({
    example: ['Freiwilliges Engagement beim Roten Halbmond', 'Schach', 'Laufen'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 'Dhaka, 22. Oktober 2026' })
  @IsOptional()
  @IsString()
  locationDate?: string;

  @ApiPropertyOptional({ example: true, default: false })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UpdateCvDto {
  @ApiPropertyOptional({ example: 'Pflegefachmann CV - Charité Berlin v2' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Pflegefachmann / Pflegefachfrau' })
  @IsOptional()
  @IsString()
  targetVocation?: string;

  @ApiPropertyOptional({ type: PersonalInfoItem })
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfoItem)
  personalInfo?: PersonalInfoItem;

  @ApiPropertyOptional({ type: [EducationItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItem)
  education?: EducationItem[];

  @ApiPropertyOptional({ type: [ExperienceItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItem)
  experience?: ExperienceItem[];

  @ApiPropertyOptional({ type: [LanguageSkillItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageSkillItem)
  languageSkills?: LanguageSkillItem[];

  @ApiPropertyOptional({ type: [SkillCategoryItem] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillCategoryItem)
  skills?: SkillCategoryItem[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @ApiPropertyOptional({ example: 'Dhaka, 22. Oktober 2026' })
  @IsOptional()
  @IsString()
  locationDate?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}
