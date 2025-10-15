import { Injectable, Inject } from '@nestjs/common';
import type { CityRepository } from '../../domain/repositories/city.repository';
import { CITY_REPOSITORY_TOKEN } from '../../domain/repositories/city.repository.token';

@Injectable()
export class GetCitiesByCountryUseCase {
  constructor(
    @Inject(CITY_REPOSITORY_TOKEN)
    private readonly cityRepository: CityRepository,
  ) {}

  async execute(countryId: string) {
    const cities = await this.cityRepository.findByCountryId(countryId);
    return {
      message: 'Cities retrieved successfully',
      cities: cities.map(city => city.toJSON()),
    };
  }
}
