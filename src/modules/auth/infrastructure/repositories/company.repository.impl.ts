import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { CompanyRepository } from '../../domain/repositories/company.repository';
import { Company } from '../../domain/entities/company.entity';

@Injectable()
export class CompanyPrismaRepository implements CompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!company) return null;

    return Company.create({
      name: company.name,
      nit: company.nit,
      email: company.email,
      phone: company.phone,
      address: company.address,
      country: company.country,
      city: company.city,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    }, company.id);
  }

  async findByNit(nit: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { nit },
    });

    if (!company) return null;

    return Company.create({
      name: company.name,
      nit: company.nit,
      email: company.email,
      phone: company.phone,
      address: company.address,
      country: company.country,
      city: company.city,
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
        country: company.country,
        city: company.city,
      },
    });

    return Company.create({
      name: created.name,
      nit: created.nit,
      email: created.email,
      phone: created.phone,
      address: created.address,
      country: created.country,
      city: created.city,
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
        country: company.country,
        city: company.city,
      },
    });

    return Company.create({
      name: updated.name,
      nit: updated.nit,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      country: updated.country,
      city: updated.city,
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
