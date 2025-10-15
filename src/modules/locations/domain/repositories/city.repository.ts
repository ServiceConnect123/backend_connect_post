import { City } from '../entities/city.entity';

export interface CityRepository {
  findAll(): Promise<City[]>;
  findById(id: string): Promise<City | null>;
  findByKey(key: string): Promise<City | null>;
  findByCountryId(countryId: string): Promise<City[]>;
  create(city: City): Promise<City>;
  update(city: City): Promise<City>;
  delete(id: string): Promise<void>;
}
