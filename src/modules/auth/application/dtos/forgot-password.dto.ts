import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email del usuario para restablecer contraseña',
    example: 'usuario@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
