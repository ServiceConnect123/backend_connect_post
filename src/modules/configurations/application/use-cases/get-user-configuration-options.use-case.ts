import { Injectable, Inject } from '@nestjs/common';
import { TIME_FORMAT_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/time-format.repository.token';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/language.repository.token';
import { CURRENCY_REPOSITORY_TOKEN } from '../../../utils/domain/repositories/currency.repository.token';
import type { TimeFormatRepository } from '../../../utils/domain/repositories/time-format.repository';
import type { LanguageRepository } from '../../../utils/domain/repositories/language.repository';
import type { CurrencyRepository } from '../../../utils/domain/repositories/currency.repository';

@Injectable()
export class GetUserConfigurationOptionsUseCase {
  constructor(
    @Inject(TIME_FORMAT_REPOSITORY_TOKEN) private readonly timeFormatRepository: TimeFormatRepository,
    @Inject(LANGUAGE_REPOSITORY_TOKEN) private readonly languageRepository: LanguageRepository,
    @Inject(CURRENCY_REPOSITORY_TOKEN) private readonly currencyRepository: CurrencyRepository,
  ) {}

  async execute() {
    console.log('🔧 Getting all user configuration options');

    const [timeFormats, languages, currencies] = await Promise.all([
      this.timeFormatRepository.findActive(),
      this.languageRepository.findActive(),
      this.currencyRepository.findActive(),
    ]);

    return {
      message: 'Opciones de configuración obtenidas exitosamente',
      options: {
        general: {
          timeFormats: timeFormats.map(tf => ({
            value: tf.value,
            name: tf.name,
            description: tf.description,
          })),
          languages: languages.map(lang => ({
            code: lang.code,
            name: lang.name,
            nativeName: lang.nativeName,
            country: lang.country,
          })),
          currencies: currencies.map(curr => ({
            code: curr.code,
            name: curr.name,
            symbol: curr.symbol,
            country: curr.country,
            type: curr.type,
            decimalPlaces: curr.decimalPlaces,
          })),
          dateFormats: [
            { value: 'DD/MM/YYYY', name: 'DD/MM/YYYY', example: '25/12/2024' },
            { value: 'MM/DD/YYYY', name: 'MM/DD/YYYY', example: '12/25/2024' },
            { value: 'YYYY-MM-DD', name: 'YYYY-MM-DD', example: '2024-12-25' },
          ],
          decimalSeparators: [
            { value: ',', name: 'Coma (,)', example: '1.234,56' },
            { value: '.', name: 'Punto (.)', example: '1,234.56' },
          ],
          itemsPerPageOptions: [10, 20, 50, 100, 200],
        },
        interface: {
          themes: [
            { value: 'light', name: 'Claro', icon: '☀️' },
            { value: 'dark', name: 'Oscuro', icon: '🌙' },
            { value: 'system', name: 'Sistema', icon: '💻' },
          ],
          primaryColors: [
            { value: '#1976d2', name: 'Azul Material', color: '#1976d2' },
            { value: '#388e3c', name: 'Verde Material', color: '#388e3c' },
            { value: '#f57c00', name: 'Naranja Material', color: '#f57c00' },
            { value: '#7b1fa2', name: 'Púrpura Material', color: '#7b1fa2' },
            { value: '#d32f2f', name: 'Rojo Material', color: '#d32f2f' },
            { value: '#1565c0', name: 'Azul Oscuro', color: '#1565c0' },
          ],
        },
      },
      meta: {
        totalTimeFormats: timeFormats.length,
        totalLanguages: languages.length,
        totalCurrencies: currencies.length,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}
