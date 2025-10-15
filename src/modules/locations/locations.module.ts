import { Module } from '@nestjs/common';
import { LocationsController } from './infrastructure/controllers/locations.controller';
import { GetCountriesUseCase } from './application/use-cases/get-countries.use-case';
import { GetCitiesByCountryUseCase } from './application/use-cases/get-cities-by-country.use-case';
import { COUNTRY_REPOSITORY_TOKEN } from './domain/repositories/country.repository.token';
import { CITY_REPOSITORY_TOKEN } from './domain/repositories/city.repository.token';
import { CountryPrismaRepository } from './infrastructure/repositories/country.repository.impl';
import { CityPrismaRepository } from './infrastructure/repositories/city.repository.impl';
import { SharedModule } from '../../shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [LocationsController],
  providers: [
    GetCountriesUseCase,
    GetCitiesByCountryUseCase,
    {
      provide: COUNTRY_REPOSITORY_TOKEN,
      useClass: CountryPrismaRepository,
    },
    {
      provide: CITY_REPOSITORY_TOKEN,
      useClass: CityPrismaRepository,
    },
  ],
  exports: [
    COUNTRY_REPOSITORY_TOKEN,
    CITY_REPOSITORY_TOKEN,
  ],
})
export class LocationsModule {}
