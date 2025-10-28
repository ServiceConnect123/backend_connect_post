import { Injectable, Inject } from '@nestjs/common';
import { CURRENCY_REPOSITORY_TOKEN } from '../../domain/repositories/currency.repository.token';
import type { CurrencyRepository } from '../../domain/repositories/currency.repository';

@Injectable()
export class GetCurrenciesUseCase {
  constructor(
    @Inject(CURRENCY_REPOSITORY_TOKEN) private readonly currencyRepository: CurrencyRepository,
  ) {}

  async execute() {
    console.log('💰 Getting all available currencies');

    const currencies = await this.currencyRepository.findActive();

    return {
      message: 'Monedas obtenidas exitosamente',
      currencies: currencies.map(curr => ({
        id: curr.id,
        code: curr.code,
        name: curr.name,
        symbol: curr.symbol,
        country: curr.country,
        type: curr.type,
        decimalPlaces: curr.decimalPlaces,
      })),
      total: currencies.length
    };
  }
}
