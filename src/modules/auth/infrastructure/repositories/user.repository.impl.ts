import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { UserRepository, UserCompanyAssociation } from '../../domain/repositories/user.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserCompany } from '../../domain/entities/user-company.entity';
import { Company } from '../../domain/entities/company.entity';
import { UserRole as PrismaUserRole } from '@prisma/client';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Helper method to convert null to undefined
  private nullToUndefined(value: string | null): string | undefined {
    return value || undefined;
  }

  // User methods
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) return null;

    return User.create({
      supabaseUuid: user.supabaseUuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: this.nullToUndefined((user as any).phone),
      documentType: this.nullToUndefined((user as any).documentType),
      documentNumber: this.nullToUndefined((user as any).documentNumber),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, user.id);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.create({
      supabaseUuid: user.supabaseUuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: this.nullToUndefined((user as any).phone),
      documentType: this.nullToUndefined((user as any).documentType),
      documentNumber: this.nullToUndefined((user as any).documentNumber),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, user.id);
  }

  async findBySupabaseUuid(supabaseUuid: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { supabaseUuid },
    });

    if (!user) return null;

    return User.create({
      supabaseUuid: user.supabaseUuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: this.nullToUndefined((user as any).phone),
      documentType: this.nullToUndefined((user as any).documentType),
      documentNumber: this.nullToUndefined((user as any).documentNumber),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, user.id);
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        supabaseUuid: user.supabaseUuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: (user as any).phone,
        documentType: (user as any).documentType,
        documentNumber: (user as any).documentNumber,
      },
    });

    return User.create({
      supabaseUuid: created.supabaseUuid,
      email: created.email,
      firstName: created.firstName,
      lastName: created.lastName,
      phone: this.nullToUndefined((created as any).phone),
      documentType: this.nullToUndefined((created as any).documentType),
      documentNumber: this.nullToUndefined((created as any).documentNumber),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: (user as any).phone,
        documentType: (user as any).documentType,
        documentNumber: (user as any).documentNumber,
      },
    });

    return User.create({
      supabaseUuid: updated.supabaseUuid,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: this.nullToUndefined((updated as any).phone),
      documentType: this.nullToUndefined((updated as any).documentType),
      documentNumber: this.nullToUndefined((updated as any).documentNumber),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  // UserCompany methods
  async findUserCompanyByUserAndCompany(userId: string, companyId: string): Promise<UserCompany | null> {
    const userCompany = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!userCompany) return null;

    return UserCompany.create({
      userId: userCompany.userId,
      companyId: userCompany.companyId,
      role: userCompany.role as UserRole,
      createdAt: userCompany.createdAt,
      updatedAt: userCompany.updatedAt,
    }, userCompany.id);
  }

  async findUserCompaniesByUserId(userId: string): Promise<UserCompany[]> {
    const userCompanies = await this.prisma.userCompany.findMany({
      where: { userId },
    });

    return userCompanies.map(uc => UserCompany.create({
      userId: uc.userId,
      companyId: uc.companyId,
      role: uc.role as UserRole,
      createdAt: uc.createdAt,
      updatedAt: uc.updatedAt,
    }, uc.id));
  }

  async findUserCompaniesBySupabaseUuid(supabaseUuid: string): Promise<UserCompanyAssociation[]> {
    // First get the user
    const user = await this.findBySupabaseUuid(supabaseUuid);
    if (!user) return [];

    // Then get user companies with company info
    const userCompanies = await this.prisma.userCompany.findMany({
      where: { userId: user.id },
      include: { company: true },
    });

    return userCompanies.map(uc => ({
      user,
      company: Company.create({
        name: uc.company.name,
        nit: uc.company.nit,
        email: uc.company.email,
        phone: uc.company.phone,
        address: uc.company.address,
        countryId: uc.company.countryId,
        cityId: uc.company.cityId,
        createdAt: uc.company.createdAt,
        updatedAt: uc.company.updatedAt,
      }, uc.company.id),
      role: uc.role as UserRole,
      userCompanyId: uc.id,
      createdAt: uc.createdAt,
      updatedAt: uc.updatedAt,
    }));
  }

  async createUserCompany(userCompany: UserCompany): Promise<UserCompany> {
    const created = await this.prisma.userCompany.create({
      data: {
        userId: userCompany.userId,
        companyId: userCompany.companyId,
        role: userCompany.role as PrismaUserRole,
      },
    });

    return UserCompany.create({
      userId: created.userId,
      companyId: created.companyId,
      role: created.role as UserRole,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async updateUserCompany(userCompany: UserCompany): Promise<UserCompany> {
    const updated = await this.prisma.userCompany.update({
      where: { id: userCompany.id },
      data: {
        role: userCompany.role as PrismaUserRole,
      },
    });

    return UserCompany.create({
      userId: updated.userId,
      companyId: updated.companyId,
      role: updated.role as UserRole,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async deleteUserCompany(id: string): Promise<void> {
    await this.prisma.userCompany.delete({
      where: { id },
    });
  }

  // Combined methods for convenience
  async findUserWithCompanies(supabaseUuid: string): Promise<{ user: User; companies: UserCompanyAssociation[] } | null> {
    const user = await this.findBySupabaseUuid(supabaseUuid);
    if (!user) return null;

    const companies = await this.findUserCompaniesBySupabaseUuid(supabaseUuid);
    return { user, companies };
  }

  async findUserCompanyAssociation(supabaseUuid: string, companyId: string): Promise<UserCompanyAssociation | null> {
    const user = await this.findBySupabaseUuid(supabaseUuid);
    if (!user) return null;

    const userCompany = await this.prisma.userCompany.findUnique({
      where: {
        userId_companyId: {
          userId: user.id,
          companyId,
        },
      },
      include: { company: true },
    });

    if (!userCompany) return null;

    return {
      user,
      company: Company.create({
        name: userCompany.company.name,
        nit: userCompany.company.nit,
        email: userCompany.company.email,
        phone: userCompany.company.phone,
        address: userCompany.company.address,
        countryId: userCompany.company.countryId,
        cityId: userCompany.company.cityId,
        createdAt: userCompany.company.createdAt,
        updatedAt: userCompany.company.updatedAt,
      }, userCompany.company.id),
      role: userCompany.role as UserRole,
      userCompanyId: userCompany.id,
      createdAt: userCompany.createdAt,
      updatedAt: userCompany.updatedAt,
    };
  }
}
