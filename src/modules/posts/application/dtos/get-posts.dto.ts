import { IsOptional, IsBoolean, IsString, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetPostsDto {
  @ApiProperty({
    description: 'Filtrar por estado de publicación',
    example: true,
    required: false,
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  published?: boolean;

  @ApiProperty({
    description: 'Número de posts por página',
    example: 10,
    minimum: 1,
    default: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiProperty({
    description: 'Desplazamiento para paginación',
    example: 0,
    minimum: 0,
    default: 0,
    required: false
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  offset?: number = 0;

  @ApiProperty({
    description: 'Término de búsqueda para filtrar en título, contenido o tags',
    example: 'nestjs',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;
}
