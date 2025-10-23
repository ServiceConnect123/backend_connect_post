import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_CONFIGURATION_REPOSITORY_TOKEN } from '../../domain/repositories/user-configuration.repository.token';
import type { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UpdateUserPreferencesDto } from '../dtos/update-user-preferences.dto';
import { UserConfiguration } from '../../domain/entities/user-configuration.entity';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(
    @Inject(USER_CONFIGURATION_REPOSITORY_TOKEN)
    private readonly userConfigurationRepository: UserConfigurationRepository,
  ) {}

  async execute(supabaseUuid: string, updateData: UpdateUserPreferencesDto) {
    console.log(`🔄 Updating user preferences for user ${supabaseUuid}`);

    try {
      let configuration = await this.userConfigurationRepository.findBySupabaseUuid(supabaseUuid);

      // If no configuration exists, create default one first
      if (!configuration) {
        console.log('📝 No configuration found, creating default configuration first');
        // This will be handled by the repository to get user ID and create default
        configuration = await this.userConfigurationRepository.findBySupabaseUuid(supabaseUuid);
      }

      if (!configuration) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Update general preferences
      const generalPreferences = {
        dateFormat: updateData.dateFormat,
        timeFormat: updateData.timeFormat,
        language: updateData.language,
        currency: updateData.currency,
        decimalSeparator: updateData.decimalSeparator,
        itemsPerPage: updateData.itemsPerPage,
      };

      // Update interface customization
      const interfaceCustomization = {
        theme: updateData.theme,
        primaryColor: updateData.primaryColor,
      };

      // Apply updates to the entity
      configuration.updateGeneralPreferences(generalPreferences);
      configuration.updateInterfaceCustomization(interfaceCustomization);

      // Save the updated configuration
      const updatedConfiguration = await this.userConfigurationRepository.update(configuration);

      console.log('✅ User preferences updated successfully');

      return {
        message: 'Preferencias actualizadas exitosamente',
        preferences: {
          id: updatedConfiguration.id,
          userId: updatedConfiguration.userId,
          generalPreferences: {
            dateFormat: updatedConfiguration.dateFormat,
            timeFormat: updatedConfiguration.timeFormat,
            language: updatedConfiguration.language,
            currency: updatedConfiguration.currency,
            decimalSeparator: updatedConfiguration.decimalSeparator,
            itemsPerPage: updatedConfiguration.itemsPerPage,
          },
          interfaceCustomization: {
            theme: updatedConfiguration.theme,
            primaryColor: updatedConfiguration.primaryColor,
          },
          updatedAt: updatedConfiguration.updatedAt,
        }
      };
    } catch (error) {
      console.error('Error updating user preferences:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error('Error al actualizar las preferencias del usuario');
    }
  }
}
