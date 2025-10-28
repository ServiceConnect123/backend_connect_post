import { Injectable, Inject } from '@nestjs/common';
import { LANGUAGE_REPOSITORY_TOKEN } from '../../domain/repositories/language.repository.token';
import type { LanguageRepository } from '../../domain/repositories/language.repository';

@Injectable()
export class GetLanguagesUseCase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY_TOKEN) private readonly languageRepository: LanguageRepository,
  ) {}

  async execute() {
    console.log('🌐 Getting all available languages');

    const languages = await this.languageRepository.findActive();

    return {
      message: 'Idiomas obtenidos exitosamente',
      languages: languages.map(lang => ({
        id: lang.id,
        code: lang.code,
        name: lang.name,
        nativeName: lang.nativeName,
        country: lang.country,
      })),
      total: languages.length
    };
  }
}
