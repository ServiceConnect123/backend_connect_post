import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Título del post',
    example: 'Mi Nuevo Post de Blog',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Contenido completo del post',
    example: 'Este es el contenido de mi nuevo post. Aquí escribo sobre temas interesantes...',
    minLength: 1
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tags para categorizar el post',
    example: ['tecnología', 'programación', 'nestjs'],
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
