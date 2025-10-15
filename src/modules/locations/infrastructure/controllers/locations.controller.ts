import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { GetCountriesUseCase } from '../../application/use-cases/get-countries.use-case';
import { GetCitiesByCountryUseCase } from '../../application/use-cases/get-cities-by-country.use-case';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
  constructor(
    private readonly getCountriesUseCase: GetCountriesUseCase,
    private readonly getCitiesByCountryUseCase: GetCitiesByCountryUseCase,
  ) {}

  @Get('countries')
  @ApiOperation({ 
    summary: 'Obtener todos los países',
    description: 'Obtiene la lista de todos los países disponibles'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Países obtenidos exitosamente',
    schema: {
      example: {
        message: 'Countries retrieved successfully',
        countries: [
          {
            id: 'clxxx-country-id-xxxx',
            key: 'CO',
            value: 'Colombia',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  })
  async getCountries() {
    return await this.getCountriesUseCase.execute();
  }

  @Get('countries/:countryId/cities')
  @ApiOperation({ 
    summary: 'Obtener ciudades por país',
    description: 'Obtiene todas las ciudades de un país específico'
  })
  @ApiParam({
    name: 'countryId',
    description: 'ID del país',
    example: 'clxxx-country-id-xxxx'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ciudades obtenidas exitosamente',
    schema: {
      example: {
        message: 'Cities retrieved successfully',
        cities: [
          {
            id: 'clxxx-city-id-xxxx',
            key: 'BOG',
            value: 'Bogotá',
            countryId: 'clxxx-country-id-xxxx',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  })
  async getCitiesByCountry(@Param('countryId') countryId: string) {
    return await this.getCitiesByCountryUseCase.execute(countryId);
  }
}
