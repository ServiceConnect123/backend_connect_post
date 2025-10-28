import { TimeFormat } from '../entities/time-format.entity';

export interface TimeFormatRepository {
  findAll(): Promise<TimeFormat[]>;
  findActive(): Promise<TimeFormat[]>;
  findById(id: string): Promise<TimeFormat | null>;
  findByValue(value: string): Promise<TimeFormat | null>;
}
