import { Controller, Get, Put, Body, Request, UseGuards } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';
import { GetUserPreferencesUseCase } from '../../application/use-cases/get-user-preferences.use-case';
import { UpdateUserPreferencesUseCase } from '../../application/use-cases/update-user-preferences.use-case';
import { UpdateUserPreferencesDto } from '../../application/dtos/update-user-preferences.dto';

@ApiTags('Configurations')
@Controller('configurations')
export class ConfigurationsController {
  constructor(
    private readonly getUserPreferencesUseCase: GetUserPreferencesUseCase,
    private readonly updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
  ) {}

  @Get('userpreferences')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener preferencias del usuario',
    description: 'Obtiene todas las preferencias de configuración del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Preferencias obtenidas exitosamente',
    schema: {
      example: {
        message: 'Preferencias obtenidas exitosamente',
        preferences: {
          id: 'config-id',
          userId: 'user-id',
          generalPreferences: {
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            language: 'es',
            currency: 'COP',
            decimalSeparator: ',',
            itemsPerPage: 20
          },
          interfaceCustomization: {
            theme: 'light',
            primaryColor: '#1976d2'
          },
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT inválido o usuario no autenticado'
  })
  @ApiNotFoundResponse({ 
    description: 'Usuario no encontrado'
  })
  async getUserPreferences(@Request() req: any) {
    const user = req.user;
    return await this.getUserPreferencesUseCase.execute(user.supabaseUuid);
  }

  @Put('userpreferences')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar preferencias del usuario',
    description: 'Actualiza las preferencias de configuración del usuario autenticado'
  })
  @ApiBody({ type: UpdateUserPreferencesDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Preferencias actualizadas exitosamente',
    schema: {
      example: {
        message: 'Preferencias actualizadas exitosamente',
        preferences: {
          id: 'config-id',
          userId: 'user-id',
          generalPreferences: {
            dateFormat: 'DD/MM/YYYY',
            timeFormat: '24h',
            language: 'es',
            currency: 'COP',
            decimalSeparator: ',',
            itemsPerPage: 20
          },
          interfaceCustomization: {
            theme: 'dark',
            primaryColor: '#2196f3'
          },
          updatedAt: '2024-01-01T12:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ 
    description: 'Token JWT inválido o usuario no autenticado'
  })
  @ApiBadRequestResponse({ 
    description: 'Datos de entrada inválidos'
  })
  @ApiNotFoundResponse({ 
    description: 'Usuario no encontrado'
  })
  async updateUserPreferences(
    @Request() req: any,
    @Body() updateUserPreferencesDto: UpdateUserPreferencesDto
  ) {
    const user = req.user;
    return await this.updateUserPreferencesUseCase.execute(
      user.supabaseUuid,
      updateUserPreferencesDto
    );
  }
}
