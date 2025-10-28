import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

// Controllers
import { UtilsController } from './infrastructure/controllers/utils.controller';

// Use Cases
import { GetTimeFormatsUseCase } from './application/use-cases/get-time-formats.use-case';
import { GetLanguagesUseCase } from './application/use-cases/get-languages.use-case';
import { GetCurrenciesUseCase } from './application/use-cases/get-currencies.use-case';

// Repositories
import { TimeFormatRepositoryImpl } from './infrastructure/repositories/time-format.repository.impl';
import { LanguageRepositoryImpl } from './infrastructure/repositories/language.repository.impl';
import { CurrencyRepositoryImpl } from './infrastructure/repositories/currency.repository.impl';

// Tokens
import { TIME_FORMAT_REPOSITORY_TOKEN } from './domain/repositories/time-format.repository.token';
import { LANGUAGE_REPOSITORY_TOKEN } from './domain/repositories/language.repository.token';
import { CURRENCY_REPOSITORY_TOKEN } from './domain/repositories/currency.repository.token';

@Module({
  imports: [SharedModule],
  controllers: [UtilsController],
  providers: [
    // Use Cases
    GetTimeFormatsUseCase,
    GetLanguagesUseCase,
    GetCurrenciesUseCase,

    // Repository Implementations
    {
      provide: TIME_FORMAT_REPOSITORY_TOKEN,
      useClass: TimeFormatRepositoryImpl,
    },
    {
      provide: LANGUAGE_REPOSITORY_TOKEN,
      useClass: LanguageRepositoryImpl,
    },
    {
      provide: CURRENCY_REPOSITORY_TOKEN,
      useClass: CurrencyRepositoryImpl,
    },
  ],
  exports: [
    TIME_FORMAT_REPOSITORY_TOKEN,
    LANGUAGE_REPOSITORY_TOKEN,
    CURRENCY_REPOSITORY_TOKEN,
  ],
})
export class UtilsModule {}
