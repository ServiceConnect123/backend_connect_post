import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum, ValidateNested, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserRole } from '../../domain/entities/user.entity';
import { CompanyCreateDto } from './company-create.dto';

export class RegisterDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'admin@netsolutionlabs.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'Password123!'
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Primer nombre del usuario',
    example: 'Wilmer',
    name: 'first_name'
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Hernandez',
    name: 'last_name'
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+57 300 123 4567',
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({
    description: 'Tipo de documento del usuario',
    example: 'CC',
    required: false
  })
  @IsString()
  @IsOptional()
  document_type?: string;

  @ApiProperty({
    description: 'Número de documento del usuario',
    example: '12345678',
    required: false
  })
  @IsString()
  @IsOptional()
  document_number?: string;

  @ApiProperty({
    description: 'Datos de la empresa a crear (requerido si no se proporciona company_id)',
    type: CompanyCreateDto,
    required: false
  })
  @ValidateNested()
  @Type(() => CompanyCreateDto)
  @ValidateIf((o) => !o.company_id)
  @IsNotEmpty({ message: 'Company data is required when company_id is not provided' })
  company?: CompanyCreateDto;

  @ApiProperty({
    description: 'ID de la empresa (opcional, si ya existe)',
    example: 'fc7b0a32-d48c-4e0d-98b1-1e4d6b8efb79',
    required: false
  })
  @IsString()
  @IsOptional()
  company_id?: string;
}
