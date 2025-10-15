import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { CountryRepository } from '../../domain/repositories/country.repository';
import { Country } from '../../domain/entities/country.entity';

@Injectable()
export class CountryPrismaRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Country[]> {
    const countries = await this.prisma.country.findMany({
      orderBy: { value: 'asc' },
    });

    return countries.map(country => Country.create({
      key: country.key,
      value: country.value,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    }, country.id));
  }

  async findById(id: string): Promise<Country | null> {
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) return null;

    return Country.create({
      key: country.key,
      value: country.value,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    }, country.id);
  }

  async findByKey(key: string): Promise<Country | null> {
    const country = await this.prisma.country.findUnique({
      where: { key },
    });

    if (!country) return null;

    return Country.create({
      key: country.key,
      value: country.value,
      createdAt: country.createdAt,
      updatedAt: country.updatedAt,
    }, country.id);
  }

  async create(country: Country): Promise<Country> {
    const created = await this.prisma.country.create({
      data: {
        id: country.id,
        key: country.key,
        value: country.value,
      },
    });

    return Country.create({
      key: created.key,
      value: created.value,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async update(country: Country): Promise<Country> {
    const updated = await this.prisma.country.update({
      where: { id: country.id },
      data: {
        key: country.key,
        value: country.value,
      },
    });

    return Country.create({
      key: updated.key,
      value: updated.value,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.country.delete({
      where: { id },
    });
  }
}
