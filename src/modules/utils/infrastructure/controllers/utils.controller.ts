import { Controller, Get } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse,
} from '@nestjs/swagger';
import { GetTimeFormatsUseCase } from '../../application/use-cases/get-time-formats.use-case';
import { GetLanguagesUseCase } from '../../application/use-cases/get-languages.use-case';
import { GetCurrenciesUseCase } from '../../application/use-cases/get-currencies.use-case';

@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  constructor(
    private readonly getTimeFormatsUseCase: GetTimeFormatsUseCase,
    private readonly getLanguagesUseCase: GetLanguagesUseCase,
    private readonly getCurrenciesUseCase: GetCurrenciesUseCase,
  ) {}

  @Get('timeFormat')
  @ApiOperation({ 
    summary: 'Obtener formatos de tiempo disponibles',
    description: 'Obtiene todos los formatos de tiempo disponibles en el sistema (12h, 24h)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Formatos de tiempo obtenidos exitosamente',
    schema: {
      example: {
        message: 'Formatos de tiempo obtenidos exitosamente',
        timeFormats: [
          {
            id: 'tf1',
            value: '12h',
            name: '12 Hours',
            description: '12-hour format with AM/PM'
          },
          {
            id: 'tf2',
            value: '24h',
            name: '24 Hours',
            description: '24-hour format'
          }
        ],
        total: 2
      }
    }
  })
  async getTimeFormats() {
    return await this.getTimeFormatsUseCase.execute();
  }

  @Get('language')
  @ApiOperation({ 
    summary: 'Obtener idiomas disponibles',
    description: 'Obtiene todos los idiomas disponibles en el sistema'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Idiomas obtenidos exitosamente',
    schema: {
      example: {
        message: 'Idiomas obtenidos exitosamente',
        languages: [
          {
            id: 'lang1',
            code: 'es',
            name: 'Spanish',
            nativeName: 'Español',
            country: 'Colombia'
          },
          {
            id: 'lang2',
            code: 'en',
            name: 'English',
            nativeName: 'English',
            country: 'United States'
          }
        ],
        total: 2
      }
    }
  })
  async getLanguages() {
    return await this.getLanguagesUseCase.execute();
  }

  @Get('currency')
  @ApiOperation({ 
    summary: 'Obtener monedas disponibles',
    description: 'Obtiene todas las monedas disponibles en el sistema con información detallada'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Monedas obtenidas exitosamente',
    schema: {
      example: {
        message: 'Monedas obtenidas exitosamente',
        currencies: [
          {
            id: 'curr1',
            code: 'COP',
            name: 'Colombian Peso',
            symbol: '$',
            country: 'Colombia',
            type: 'Pesos',
            decimalPlaces: 0
          },
          {
            id: 'curr2',
            code: 'USD',
            name: 'US Dollar',
            symbol: '$',
            country: 'United States',
            type: 'Dollars',
            decimalPlaces: 2
          }
        ],
        total: 2
      }
    }
  })
  async getCurrencies() {
    return await this.getCurrenciesUseCase.execute();
  }
}
