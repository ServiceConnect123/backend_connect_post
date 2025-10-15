import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { CityRepository } from '../../domain/repositories/city.repository';
import { City } from '../../domain/entities/city.entity';

@Injectable()
export class CityPrismaRepository implements CityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<City[]> {
    const cities = await this.prisma.city.findMany({
      orderBy: { value: 'asc' },
    });

    return cities.map(city => City.create({
      key: city.key,
      value: city.value,
      countryId: city.countryId,
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }, city.id));
  }

  async findById(id: string): Promise<City | null> {
    const city = await this.prisma.city.findUnique({
      where: { id },
    });

    if (!city) return null;

    return City.create({
      key: city.key,
      value: city.value,
      countryId: city.countryId,
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }, city.id);
  }

  async findByKey(key: string): Promise<City | null> {
    const city = await this.prisma.city.findUnique({
      where: { key },
    });

    if (!city) return null;

    return City.create({
      key: city.key,
      value: city.value,
      countryId: city.countryId,
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }, city.id);
  }

  async findByCountryId(countryId: string): Promise<City[]> {
    const cities = await this.prisma.city.findMany({
      where: { countryId },
      orderBy: { value: 'asc' },
    });

    return cities.map(city => City.create({
      key: city.key,
      value: city.value,
      countryId: city.countryId,
      createdAt: city.createdAt,
      updatedAt: city.updatedAt,
    }, city.id));
  }

  async create(city: City): Promise<City> {
    const created = await this.prisma.city.create({
      data: {
        id: city.id,
        key: city.key,
        value: city.value,
        countryId: city.countryId,
      },
    });

    return City.create({
      key: created.key,
      value: created.value,
      countryId: created.countryId,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async update(city: City): Promise<City> {
    const updated = await this.prisma.city.update({
      where: { id: city.id },
      data: {
        key: city.key,
        value: city.value,
        countryId: city.countryId,
      },
    });

    return City.create({
      key: updated.key,
      value: updated.value,
      countryId: updated.countryId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.city.delete({
      where: { id },
    });
  }
}
