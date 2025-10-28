import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { USER_CONFIGURATION_REPOSITORY_TOKEN } from '../../domain/repositories/user-configuration.repository.token';
import type { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UpdateUserPreferencesDto } from '../dtos/update-user-preferences.dto';
import { UserConfiguration } from '../../domain/entities/user-configuration.entity';
import { TIME_FORMAT_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/time-format.repository.token';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/language.repository.token';
import { CURRENCY_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/currency.repository.token';
import type { TimeFormatRepository } from '../../../utils/domain/repositories/time-format.repository';
import type { LanguageRepository } from '../../../utils/domain/repositories/language.repository';
import type { CurrencyRepository } from '../../../utils/domain/repositories/currency.repository';

@Injectable()
export class UpdateUserPreferencesUseCase {
  constructor(
    @Inject(USER_CONFIGURATION_REPOSITORY_TOKEN)
    private readonly userConfigurationRepository: UserConfigurationRepository,
    @Inject(TIME_FORMAT_REPOSITORY_TOKEN)
    private readonly timeFormatRepository: TimeFormatRepository,
    @Inject(LANGUAGE_REPOSITORY_TOKEN)
    private readonly languageRepository: LanguageRepository,
    @Inject(CURRENCY_REPOSITORY_TOKEN)
    private readonly currencyRepository: CurrencyRepository,
  ) {}

  async execute(supabaseUuid: string, updateData: UpdateUserPreferencesDto) {
    console.log(`🔄 Updating user preferences for user ${supabaseUuid}`);

    try {
      // Validate values against database tables
      await this.validateUpdateData(updateData);

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

      // Update general preferences with IDs
      const generalPreferences = {
        dateFormat: updateData.dateFormat,
        timeFormatId: updateData.timeFormat,
        languageId: updateData.language,
        currencyId: updateData.currency,
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

  private async validateUpdateData(updateData: UpdateUserPreferencesDto): Promise<void> {
    const errors: string[] = [];

    // Validate time format by ID
    if (updateData.timeFormat) {
      const timeFormat = await this.timeFormatRepository.findById(updateData.timeFormat);
      if (!timeFormat) {
        errors.push(`ID de formato de tiempo inválido: ${updateData.timeFormat}. Use los endpoints /utils/timeFormat para obtener IDs válidos.`);
      }
    }

    // Validate language by ID
    if (updateData.language) {
      const language = await this.languageRepository.findById(updateData.language);
      if (!language) {
        errors.push(`ID de idioma inválido: ${updateData.language}. Use los endpoints /utils/language para obtener IDs válidos.`);
      }
    }

    // Validate currency by ID
    if (updateData.currency) {
      const currency = await this.currencyRepository.findById(updateData.currency);
      if (!currency) {
        errors.push(`ID de moneda inválido: ${updateData.currency}. Use los endpoints /utils/currency para obtener IDs válidos.`);
      }
    }

    // Validate decimal separator
    if (updateData.decimalSeparator && ![',', '.'].includes(updateData.decimalSeparator)) {
      errors.push(`Separador decimal inválido: ${updateData.decimalSeparator}. Use ',' o '.'`);
    }

    // Validate items per page
    if (updateData.itemsPerPage && (updateData.itemsPerPage < 1 || updateData.itemsPerPage > 1000)) {
      errors.push(`Número de elementos por página inválido: ${updateData.itemsPerPage}. Debe estar entre 1 y 1000.`);
    }

    // Validate theme
    if (updateData.theme && !['light', 'dark', 'system'].includes(updateData.theme)) {
      errors.push(`Tema inválido: ${updateData.theme}. Use 'light', 'dark' o 'system'.`);
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Datos de configuración inválidos',
        errors,
        hint: 'Use los endpoints /utils/timeFormat, /utils/language, y /utils/currency para obtener IDs válidos'
      });
    }
  }
}
