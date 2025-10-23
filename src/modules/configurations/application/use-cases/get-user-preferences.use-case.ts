import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_CONFIGURATION_REPOSITORY_TOKEN } from '../../domain/repositories/user-configuration.repository.token';
import type { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UpdateUserPreferencesDto } from '../dtos/update-user-preferences.dto';

@Injectable()
export class GetUserPreferencesUseCase {
  constructor(
    @Inject(USER_CONFIGURATION_REPOSITORY_TOKEN)
    private readonly userConfigurationRepository: UserConfigurationRepository,
  ) {}

  async execute(supabaseUuid: string) {
    console.log(`🔍 Getting user preferences for user ${supabaseUuid}`);

    try {
      let configuration = await this.userConfigurationRepository.findBySupabaseUuid(supabaseUuid);

      // If no configuration exists, create default one
      if (!configuration) {
        console.log('📝 No configuration found, creating default configuration');
        // We need to get the user ID first
        // For now, we'll handle this in the repository implementation
        configuration = await this.userConfigurationRepository.findBySupabaseUuid(supabaseUuid);
      }

      if (!configuration) {
        throw new NotFoundException('Usuario no encontrado');
      }

      console.log('✅ User preferences retrieved successfully');

      return {
        message: 'Preferencias obtenidas exitosamente',
        preferences: {
          id: configuration.id,
          userId: configuration.userId,
          generalPreferences: {
            dateFormat: configuration.dateFormat,
            timeFormat: configuration.timeFormat,
            language: configuration.language,
            currency: configuration.currency,
            decimalSeparator: configuration.decimalSeparator,
            itemsPerPage: configuration.itemsPerPage,
          },
          interfaceCustomization: {
            theme: configuration.theme,
            primaryColor: configuration.primaryColor,
          },
          createdAt: configuration.createdAt,
          updatedAt: configuration.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error('Error al obtener las preferencias del usuario');
    }
  }
}
