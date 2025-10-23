import { IsOptional, IsString, IsInt, IsIn, Matches, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPreferencesDto {
  @ApiProperty({
    description: 'Formato de fecha',
    example: 'DD/MM/YYYY',
    enum: ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])
  dateFormat?: string;

  @ApiProperty({
    description: 'Formato de hora',
    example: '24h',
    enum: ['12h', '24h'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['12h', '24h'])
  timeFormat?: string;

  @ApiProperty({
    description: 'Idioma de la interfaz',
    example: 'es',
    enum: ['es', 'en'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['es', 'en'])
  language?: string;

  @ApiProperty({
    description: 'Moneda predeterminada',
    example: 'COP',
    enum: ['COP', 'USD', 'GTQ', 'EUR'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['COP', 'USD', 'GTQ', 'EUR'])
  currency?: string;

  @ApiProperty({
    description: 'Separador decimal',
    example: ',',
    enum: [',', '.'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn([',', '.'])
  decimalSeparator?: string;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 20,
    enum: [10, 20, 50, 100],
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsIn([10, 20, 50, 100])
  itemsPerPage?: number;

  @ApiProperty({
    description: 'Tema de color',
    example: 'light',
    enum: ['light', 'dark', 'system'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['light', 'dark', 'system'])
  theme?: string;

  @ApiProperty({
    description: 'Color principal (formato hexadecimal)',
    example: '#1976d2',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'El color debe estar en formato hexadecimal válido (ej: #1976d2)',
  })
  primaryColor?: string;
}
