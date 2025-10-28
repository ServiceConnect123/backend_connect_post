import { Language } from '../entities/language.entity';

export interface LanguageRepository {
  findAll(): Promise<Language[]>;
  findActive(): Promise<Language[]>;
  findById(id: string): Promise<Language | null>;
  findByCode(code: string): Promise<Language | null>;
}
