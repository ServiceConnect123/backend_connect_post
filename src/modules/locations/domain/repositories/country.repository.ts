import { Country } from '../entities/country.entity';

export interface CountryRepository {
  findAll(): Promise<Country[]>;
  findById(id: string): Promise<Country | null>;
  findByKey(key: string): Promise<Country | null>;
  create(country: Country): Promise<Country>;
  update(country: Country): Promise<Country>;
  delete(id: string): Promise<void>;
}
