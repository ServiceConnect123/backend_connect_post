import { IsOptional, IsString, IsInt, Matches, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPreferencesDto {
  @ApiProperty({
    description: 'Formato de fecha',
    example: 'DD/MM/YYYY',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateFormat?: string;

  @ApiProperty({
    description: 'ID del formato de hora - debe ser un ID válido de la tabla time_formats',
    example: 'tf2',
    required: false,
  })
  @IsOptional()
  @IsString()
  timeFormat?: string;

  @ApiProperty({
    description: 'ID del idioma - debe ser un ID válido de la tabla languages',
    example: 'lang1',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'ID de la moneda - debe ser un ID válido de la tabla currencies',
    example: 'curr1',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    description: 'Separador decimal',
    example: ',',
    required: false,
  })
  @IsOptional()
  @IsString()
  decimalSeparator?: string;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 20,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  itemsPerPage?: number;

  @ApiProperty({
    description: 'Tema de color',
    example: 'light',
    required: false,
  })
  @IsOptional()
  @IsString()
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
