import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { CurrencyRepository } from '../../domain/repositories/currency.repository';
import { Currency } from '../../domain/entities/currency.entity';

@Injectable()
export class CurrencyRepositoryImpl implements CurrencyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Currency[]> {
    const currencies = await this.prisma.currency.findMany({
      orderBy: { name: 'asc' }
    });

    return currencies.map(curr => Currency.create({
      code: curr.code,
      name: curr.name,
      symbol: curr.symbol,
      country: curr.country,
      type: curr.type,
      decimalPlaces: curr.decimalPlaces,
      isActive: curr.isActive,
      createdAt: curr.createdAt,
      updatedAt: curr.updatedAt,
    }, curr.id));
  }

  async findActive(): Promise<Currency[]> {
    const currencies = await this.prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return currencies.map(curr => Currency.create({
      code: curr.code,
      name: curr.name,
      symbol: curr.symbol,
      country: curr.country,
      type: curr.type,
      decimalPlaces: curr.decimalPlaces,
      isActive: curr.isActive,
      createdAt: curr.createdAt,
      updatedAt: curr.updatedAt,
    }, curr.id));
  }

  async findById(id: string): Promise<Currency | null> {
    const currency = await this.prisma.currency.findUnique({
      where: { id }
    });

    if (!currency) return null;

    return Currency.create({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      country: currency.country,
      type: currency.type,
      decimalPlaces: currency.decimalPlaces,
      isActive: currency.isActive,
      createdAt: currency.createdAt,
      updatedAt: currency.updatedAt,
    }, currency.id);
  }

  async findByCode(code: string): Promise<Currency | null> {
    const currency = await this.prisma.currency.findUnique({
      where: { code }
    });

    if (!currency) return null;

    return Currency.create({
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      country: currency.country,
      type: currency.type,
      decimalPlaces: currency.decimalPlaces,
      isActive: currency.isActive,
      createdAt: currency.createdAt,
      updatedAt: currency.updatedAt,
    }, currency.id);
  }
}
