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
import { GetUserConfigurationOptionsUseCase } from '../../application/use-cases/get-user-configuration-options.use-case';
import { UpdateUserPreferencesDto } from '../../application/dtos/update-user-preferences.dto';

@ApiTags('Configurations')
@Controller('configurations')
export class ConfigurationsController {
  constructor(
    private readonly getUserPreferencesUseCase: GetUserPreferencesUseCase,
    private readonly updateUserPreferencesUseCase: UpdateUserPreferencesUseCase,
    private readonly getUserConfigurationOptionsUseCase: GetUserConfigurationOptionsUseCase,
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
    console.log('🔍 GetUserPreferences - User object keys:', Object.keys(user));
    console.log('🔍 GetUserPreferences - User ID:', user.id);
    console.log('🔍 GetUserPreferences - User email:', user.email);
    return await this.getUserPreferencesUseCase.execute(user.id); // Use user.id instead of user.supabaseUuid
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
    console.log('🔍 UpdateUserPreferences - User object keys:', Object.keys(user));
    console.log('🔍 UpdateUserPreferences - User ID:', user.id);
    console.log('🔍 UpdateUserPreferences - User email:', user.email);
    return await this.updateUserPreferencesUseCase.execute(
      user.id, // Use user.id instead of user.supabaseUuid
      updateUserPreferencesDto
    );
  }

  @Get('options')
  @ApiOperation({ 
    summary: 'Obtener opciones de configuración disponibles',
    description: 'Obtiene todas las opciones disponibles para configuración de usuario desde la base de datos (formatos de tiempo, idiomas, monedas, etc.)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Opciones de configuración obtenidas exitosamente',
    schema: {
      example: {
        message: 'Opciones de configuración obtenidas exitosamente',
        options: {
          general: {
            timeFormats: [
              { value: '12h', name: '12 Hours', description: '12-hour format with AM/PM' },
              { value: '24h', name: '24 Hours', description: '24-hour format' }
            ],
            languages: [
              { code: 'es', name: 'Spanish', nativeName: 'Español', country: 'Colombia' },
              { code: 'en', name: 'English', nativeName: 'English', country: 'United States' }
            ],
            currencies: [
              { code: 'COP', name: 'Colombian Peso', symbol: '$', country: 'Colombia', type: 'Pesos', decimalPlaces: 0 },
              { code: 'USD', name: 'US Dollar', symbol: '$', country: 'United States', type: 'Dollars', decimalPlaces: 2 }
            ],
            dateFormats: [
              { value: 'DD/MM/YYYY', name: 'DD/MM/YYYY', example: '25/12/2024' }
            ],
            decimalSeparators: [
              { value: ',', name: 'Coma (,)', example: '1.234,56' }
            ]
          },
          interface: {
            themes: [
              { value: 'light', name: 'Claro', icon: '☀️' },
              { value: 'dark', name: 'Oscuro', icon: '🌙' }
            ],
            primaryColors: [
              { value: '#1976d2', name: 'Azul Material', color: '#1976d2' }
            ]
          }
        },
        meta: {
          totalTimeFormats: 2,
          totalLanguages: 4,
          totalCurrencies: 5,
          lastUpdated: '2024-10-26T12:00:00.000Z'
        }
      }
    }
  })
  async getConfigurationOptions() {
    return await this.getUserConfigurationOptionsUseCase.execute();
  }
}
