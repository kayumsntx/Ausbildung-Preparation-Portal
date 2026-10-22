import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SenderBlockDto {
  @ApiProperty({ example: 'Max Mustermann' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'House 12, Road 4, Dhanmondi' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ example: '1205 Dhaka, Bangladesch' })
  @IsNotEmpty()
  @IsString()
  postalCodeCity!: string;

  @ApiProperty({ example: '+880 1712 345678' })
  @IsNotEmpty()
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'max.mustermann@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}

export class RecipientBlockDto {
  @ApiProperty({ example: 'Charité – Universitätsmedizin Berlin' })
  @IsNotEmpty()
  @IsString()
  company!: string;

  @ApiPropertyOptional({ example: 'Frau Dr. Stefanie Weber' })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'Zentrale Bewerbungsstelle Pflege & Ausbildung' })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ example: 'Charitéplatz 1' })
  @IsNotEmpty()
  @IsString()
  address!: string;

  @ApiProperty({ example: '10117 Berlin' })
  @IsNotEmpty()
  @IsString()
  postalCodeCity!: string;
}

export class CreateCoverLetterDto {
  @ApiProperty({ example: 'Anschreiben Charité Pflege 2027' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ type: SenderBlockDto })
  @ValidateNested()
  @Type(() => SenderBlockDto)
  senderBlock!: SenderBlockDto;

  @ApiProperty({ type: RecipientBlockDto })
  @ValidateNested()
  @Type(() => RecipientBlockDto)
  recipientBlock!: RecipientBlockDto;

  @ApiProperty({ example: 'Dhaka, den 22. Oktober 2026' })
  @IsNotEmpty()
  @IsString()
  dateLine!: string;

  @ApiProperty({
    example: 'Bewerbung um einen Ausbildungsplatz als Pflegefachmann (m/w/d) zum 01.09.2027',
  })
  @IsNotEmpty()
  @IsString()
  subjectLine!: string;

  @ApiProperty({ example: 'Sehr geehrte Frau Dr. Weber,' })
  @IsNotEmpty()
  @IsString()
  salutation!: string;

  @ApiProperty({
    example:
      'mit großem Interesse habe ich Ihre Stellenausschreibung für die generalistische Pflegeausbildung an der Charité verfolgt. Als engagierte und einfühlsame Persönlichkeit mit erfolgreich absolviertem B2-Goethe-Zertifikat ist es mein fester Entschluss, meine berufliche Zukunft in der qualifizierten Krankenpflege in Deutschland aufzubauen.\n\nDurch mein einjähriges Praktikum am Dhaka Community Hospital konnte ich bereits wertvolle praktische Erfahrungen sammeln und den anspruchsvollen Stationsalltag kennenlernen. Die Patientinnen und Patienten schätzen meine Geduld, meine Zuverlässigkeit und mein hohes Verantwortungsbewusstsein.\n\nIch freue mich sehr über die Gelegenheit, mich Ihnen in einem persönlichen oder digitalen Vorstellungsgespräch vorzustellen.',
  })
  @IsNotEmpty()
  @IsString()
  bodyText!: string;

  @ApiPropertyOptional({ example: 'Mit freundlichen Grüßen', default: 'Mit freundlichen Grüßen' })
  @IsOptional()
  @IsString()
  signOff?: string;

  @ApiPropertyOptional({
    example: 'Anlagen: Tabellarischer Lebenslauf, Zeugnisse, B2-Sprachzertifikat',
    default: 'Anlagen: Tabellarischer Lebenslauf, Zeugnisse, Sprachzertifikat',
  })
  @IsOptional()
  @IsString()
  enclosures?: string;
}

export class UpdateCoverLetterDto {
  @ApiPropertyOptional({ example: 'Anschreiben Charité Pflege 2027 (Überarbeitet)' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ type: SenderBlockDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SenderBlockDto)
  senderBlock?: SenderBlockDto;

  @ApiPropertyOptional({ type: RecipientBlockDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecipientBlockDto)
  recipientBlock?: RecipientBlockDto;

  @ApiPropertyOptional({ example: 'Dhaka, den 22. Oktober 2026' })
  @IsOptional()
  @IsString()
  dateLine?: string;

  @ApiPropertyOptional({
    example: 'Bewerbung um einen Ausbildungsplatz als Pflegefachmann (m/w/d)',
  })
  @IsOptional()
  @IsString()
  subjectLine?: string;

  @ApiPropertyOptional({ example: 'Sehr geehrte Frau Dr. Weber,' })
  @IsOptional()
  @IsString()
  salutation?: string;

  @ApiPropertyOptional({ example: 'Überarbeiteter Fließtext...' })
  @IsOptional()
  @IsString()
  bodyText?: string;

  @ApiPropertyOptional({ example: 'Mit freundlichen Grüßen' })
  @IsOptional()
  @IsString()
  signOff?: string;

  @ApiPropertyOptional({ example: 'Anlagen' })
  @IsOptional()
  @IsString()
  enclosures?: string;
}
