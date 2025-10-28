import { Currency } from '../entities/currency.entity';

export interface CurrencyRepository {
  findAll(): Promise<Currency[]>;
  findActive(): Promise<Currency[]>;
  findById(id: string): Promise<Currency | null>;
  findByCode(code: string): Promise<Currency | null>;
}
