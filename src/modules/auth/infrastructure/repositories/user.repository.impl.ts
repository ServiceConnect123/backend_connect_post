import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { UserRole as PrismaUserRole } from '@prisma/client';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.create({
      supabaseUuid: user.supabaseUuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      companyId: user.companyId,
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
      role: user.role as UserRole,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, user.id);
  }

  async findBySupabaseUuid(supabaseUuid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { supabaseUuid },
    });

    if (!user) return null;

    return User.create({
      supabaseUuid: user.supabaseUuid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserRole,
      companyId: user.companyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }, user.id);
  }

  async save(user: User): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (existingUser) {
      return this.update(user);
    } else {
      return this.create(user);
    }
  }

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        id: user.id,
        supabaseUuid: user.supabaseUuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role as PrismaUserRole,
        companyId: user.companyId,
      },
      include: { company: true },
    });

    return User.create({
      supabaseUuid: created.supabaseUuid,
      email: created.email,
      firstName: created.firstName,
      lastName: created.lastName,
      role: created.role as UserRole,
      companyId: created.companyId,
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
        role: user.role as PrismaUserRole,
        companyId: user.companyId,
      },
      include: { company: true },
    });

    return User.create({
      supabaseUuid: updated.supabaseUuid,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      role: updated.role as UserRole,
      companyId: updated.companyId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
