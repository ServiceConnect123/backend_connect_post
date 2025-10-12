import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Nuevo título del post',
    example: 'Título Actualizado',
    required: false
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Nuevo contenido del post',
    example: 'Contenido actualizado del post...',
    required: false
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Nuevos tags para el post',
    example: ['actualizado', 'modificado'],
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
