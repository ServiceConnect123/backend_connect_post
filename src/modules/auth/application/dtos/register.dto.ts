import { IsEmail, IsNotEmpty, MinLength, IsString, IsEnum, ValidateNested, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../domain/entities/user.entity';

export class CompanyDto {
  @ApiProperty({
    description: 'Nombre de la empresa',
    example: 'NetSolutionLabs'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'NIT de la empresa',
    example: '900123456-7'
  })
  @IsString()
  @IsNotEmpty()
  nit: string;

  @ApiProperty({
    description: 'Email de contacto de la empresa',
    example: 'contact@netsolutionlabs.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Teléfono de la empresa',
    example: '+57 3001234567'
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Dirección de la empresa',
    example: 'Cra 10 # 45-23'
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'País de la empresa',
    example: 'Colombia'
  })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({
    description: 'Ciudad de la empresa',
    example: 'Barranquilla'
  })
  @IsString()
  @IsNotEmpty()
  city: string;
}

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
    example: 'Wilmer'
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Hernandez'
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
    description: 'Datos de la empresa (para crear nueva empresa)',
    type: CompanyDto,
    required: false
  })
  @ValidateNested()
  @Type(() => CompanyDto)
  @IsOptional()
  company?: CompanyDto;

  @ApiProperty({
    description: 'ID de empresa existente',
    example: 'fc7b0a32-d48c-4e0d-98b1-1e4d6b8efb79',
    required: false
  })
  @IsUUID()
  @IsOptional()
  company_id?: string;
}
