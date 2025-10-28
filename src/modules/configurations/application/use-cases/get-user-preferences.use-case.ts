import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_CONFIGURATION_REPOSITORY_TOKEN } from '../../domain/repositories/user-configuration.repository.token';
import type { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UpdateUserPreferencesDto } from '../dtos/update-user-preferences.dto';
import { TIME_FORMAT_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/time-format.repository.token';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/language.repository.token';
import { CURRENCY_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/currency.repository.token';
import type { TimeFormatRepository } from '../../../utils/domain/repositories/time-format.repository';
import type { LanguageRepository } from '../../../utils/domain/repositories/language.repository';
import type { CurrencyRepository } from '../../../utils/domain/repositories/currency.repository';

@Injectable()
export class GetUserPreferencesUseCase {
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

      // Get available options from utils tables
      const [timeFormats, languages, currencies] = await Promise.all([
        this.timeFormatRepository.findActive(),
        this.languageRepository.findActive(),
        this.currencyRepository.findActive(),
      ]);

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
        },
        availableOptions: {
          timeFormats: timeFormats.map(tf => ({
            id: tf.id,
            value: tf.value,
            name: tf.name,
            description: tf.description,
          })),
          languages: languages.map(lang => ({
            id: lang.id,
            code: lang.code,
            name: lang.name,
            nativeName: lang.nativeName,
            country: lang.country,
          })),
          currencies: currencies.map(curr => ({
            id: curr.id,
            code: curr.code,
            name: curr.name,
            symbol: curr.symbol,
            country: curr.country,
            type: curr.type,
            decimalPlaces: curr.decimalPlaces,
          })),
          themes: ['light', 'dark', 'system'],
          decimalSeparators: [',', '.'],
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
