import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { Company } from '../../domain/entities/company.entity';
import { Country } from '../../../locations/domain/entities/country.entity';
import { City } from '../../../locations/domain/entities/city.entity';

@Injectable()
export class CompanyPrismaRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        country: true,
        city: true,
      },
    });

    if (!company) return null;

    return Company.create({
      name: company.name,
      nit: company.nit,
      email: company.email,
      phone: company.phone,
      address: company.address,
      countryId: company.countryId,
      cityId: company.cityId,
      country: company.country ? Country.create({
        key: company.country.key,
        value: company.country.value,
        createdAt: company.country.createdAt,
        updatedAt: company.country.updatedAt,
      }, company.country.id) : undefined,
      city: company.city ? City.create({
        key: company.city.key,
        value: company.city.value,
        countryId: company.city.countryId,
        createdAt: company.city.createdAt,
        updatedAt: company.city.updatedAt,
      }, company.city.id) : undefined,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }, company.id);
  }

  async findByNit(nit: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { nit },
      include: {
        country: true,
        city: true,
      },
    });

    if (!company) return null;

    return Company.create({
      name: company.name,
      nit: company.nit,
      email: company.email,
      phone: company.phone,
      address: company.address,
      countryId: company.countryId,
      cityId: company.cityId,
      country: company.country ? Country.create({
        key: company.country.key,
        value: company.country.value,
        createdAt: company.country.createdAt,
        updatedAt: company.country.updatedAt,
      }, company.country.id) : undefined,
      city: company.city ? City.create({
        key: company.city.key,
        value: company.city.value,
        countryId: company.city.countryId,
        createdAt: company.city.createdAt,
        updatedAt: company.city.updatedAt,
      }, company.city.id) : undefined,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }, company.id);
  }

  async create(company: Company): Promise<Company> {
    const created = await this.prisma.company.create({
      data: {
        id: company.id,
        name: company.name,
        nit: company.nit,
        email: company.email,
        phone: company.phone,
        address: company.address,
        countryId: company.countryId,
        cityId: company.cityId,
      },
      include: {
        country: true,
        city: true,
      },
    });

    return Company.create({
      name: created.name,
      nit: created.nit,
      email: created.email,
      phone: created.phone,
      address: created.address,
      countryId: created.countryId,
      cityId: created.cityId,
      country: created.country ? Country.create({
        key: created.country.key,
        value: created.country.value,
        createdAt: created.country.createdAt,
        updatedAt: created.country.updatedAt,
      }, created.country.id) : undefined,
      city: created.city ? City.create({
        key: created.city.key,
        value: created.city.value,
        countryId: created.city.countryId,
        createdAt: created.city.createdAt,
        updatedAt: created.city.updatedAt,
      }, created.city.id) : undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async update(company: Company): Promise<Company> {
    const updated = await this.prisma.company.update({
      where: { id: company.id },
      data: {
        name: company.name,
        nit: company.nit,
        email: company.email,
        phone: company.phone,
        address: company.address,
        countryId: company.countryId,
        cityId: company.cityId,
      },
      include: {
        country: true,
        city: true,
      },
    });

    return Company.create({
      name: updated.name,
      nit: updated.nit,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      countryId: updated.countryId,
      cityId: updated.cityId,
      country: updated.country ? Country.create({
        key: updated.country.key,
        value: updated.country.value,
        createdAt: updated.country.createdAt,
        updatedAt: updated.country.updatedAt,
      }, updated.country.id) : undefined,
      city: updated.city ? City.create({
        key: updated.city.key,
        value: updated.city.value,
        countryId: updated.city.countryId,
        createdAt: updated.city.createdAt,
        updatedAt: updated.city.updatedAt,
      }, updated.city.id) : undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }
}
