import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompanyCreateDto {
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
    description: 'Email de la empresa',
    example: 'contact@netsolutionlabs.com'
  })
  @IsString()
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
    description: 'ID del país',
    example: 'clxxx-country-id-xxxx'
  })
  @IsString()
  @IsNotEmpty()
  countryId: string;

  @ApiProperty({
    description: 'ID de la ciudad',
    example: 'clxxx-city-id-xxxx'
  })
  @IsString()
  @IsNotEmpty()
  cityId: string;
}
