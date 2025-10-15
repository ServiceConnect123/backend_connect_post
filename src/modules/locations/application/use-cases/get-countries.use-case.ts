import { Injectable, Inject } from '@nestjs/common';
import type { CountryRepository } from '../../domain/repositories/country.repository';
import { COUNTRY_REPOSITORY_TOKEN } from '../../domain/repositories/country.repository.token';

@Injectable()
export class GetCountriesUseCase {
  constructor(
    @Inject(COUNTRY_REPOSITORY_TOKEN)
    private readonly countryRepository: CountryRepository,
  ) {}

  async execute() {
    const countries = await this.countryRepository.findAll();
    return {
      message: 'Countries retrieved successfully',
      countries: countries.map(country => country.toJSON()),
    };
  }
}
