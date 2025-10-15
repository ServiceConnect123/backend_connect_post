import { Controller, Post, Body, Get, Request, UseGuards, Put } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse 
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { GetProfileUseCase } from '../../application/use-cases/get-profile.use-case';
import { LoginDto } from '../../application/dtos/login.dto';
import { RegisterDto } from '../../application/dtos/register.dto';
import { ForgotPasswordDto } from '../../application/dtos/forgot-password.dto';
import { ResetPasswordDto } from '../../application/dtos/reset-password.dto';
import { SupabaseAuthService } from '../services/supabase-auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly supabaseAuthService: SupabaseAuthService,
  ) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en el sistema con Supabase Auth'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    schema: {
      example: {
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: 'uuid-here',
          email: 'user@example.com',
          name: 'User Name',
          emailConfirmed: false
        },
        session: {
          accessToken: 'jwt-token-here',
          refreshToken: 'refresh-token-here',
          expiresAt: 1234567890
        }
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos',
    schema: {
      example: {
        statusCode: 400,
        message: ['email must be an email', 'password must be longer than or equal to 6 characters'],
        error: 'Bad Request'
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.registerUseCase.execute(registerDto);
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve tokens de acceso'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          id: 'uuid-here',
          email: 'user@example.com',
          name: 'User Name',
          emailConfirmed: true
        },
        session: {
          accessToken: 'jwt-token-here',
          refreshToken: 'refresh-token-here',
          expiresAt: 1234567890
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Credenciales inválidas',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid credentials',
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.loginUseCase.execute(loginDto);
  }

  @Post('logout')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Cerrar sesión',
    description: 'Cierra la sesión del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Logout exitoso',
    schema: {
      example: {
        message: 'Logout successful'
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token no válido o expirado'
  })
  async logout() {
    const result = await this.supabaseAuthService.signOut();
    if (result.error) {
      return { message: 'Logout failed', error: result.error.message };
    }
    return { message: 'Logout successful' };
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener perfil de usuario',
    description: 'Obtiene la información del perfil del usuario autenticado incluyendo datos de la empresa'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    schema: {
      example: {
        message: 'Profile retrieved successfully',
        user: {
          id: 'cuid-user-id',
          supabaseUuid: 'supabase-uuid-here',
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          role: 'ADMIN',
          emailConfirmed: true,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
          lastSignIn: '2024-01-01T12:00:00.000Z',
          company: {
            id: 'company-id',
            name: 'NetSolutionLabs',
            nit: '900123456-7',
            email: 'contact@netsolutionlabs.com',
            phone: '+57 3001234567',
            address: 'Cra 10 # 45-23',
            country: 'Colombia',
            city: 'Barranquilla'
          }
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token no válido o expirado'
  })
  async getProfile(@Request() req: any) {
    try {
      const profileData = await this.getProfileUseCase.execute(req.user.id);

      return {
        message: 'Profile retrieved successfully',
        user: {
          ...profileData.user,
          emailConfirmed: req.user.email_confirmed_at !== null,
          lastSignIn: req.user.last_sign_in_at,
          company: profileData.company
        },
      };
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      return {
        message: 'Error retrieving profile',
        error: error.message || 'Internal server error'
      };
    }
  }

  @Post('forgot-password')
  @ApiOperation({ 
    summary: 'Solicitar restablecimiento de contraseña',
    description: 'Envía un email con link para restablecer la contraseña'
  })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de restablecimiento enviado',
    schema: {
      example: {
        message: 'Password reset email sent'
      }
    }
  })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.supabaseAuthService.resetPassword(forgotPasswordDto.email);
    if (result.error) {
      return { message: 'Password reset failed', error: result.error.message };
    }
    return { message: 'Password reset email sent' };
  }

  @Post('reset-password')
  @ApiOperation({ 
    summary: 'Restablecer contraseña',
    description: 'Actualiza la contraseña usando el token del email de restablecimiento'
  })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Contraseña actualizada exitosamente',
    schema: {
      example: {
        message: 'Password updated successfully'
      }
    }
  })
  @ApiBadRequestResponse({ 
    description: 'Token inválido o contraseña no válida'
  })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.supabaseAuthService.updatePassword(
      resetPasswordDto.accessToken,
      resetPasswordDto.newPassword,
    );
    if (result.error) {
      return { message: 'Password update failed', error: result.error.message };
    }
    return { message: 'Password updated successfully' };
  }
}
