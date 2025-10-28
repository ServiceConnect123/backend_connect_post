import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { LanguageRepository } from '../../domain/repositories/language.repository';
import { Language } from '../../domain/entities/language.entity';

@Injectable()
export class LanguageRepositoryImpl implements LanguageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Language[]> {
    const languages = await this.prisma.language.findMany({
      orderBy: { name: 'asc' }
    });

    return languages.map(lang => Language.create({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName || undefined,
      country: lang.country || undefined,
      isActive: lang.isActive,
      createdAt: lang.createdAt,
      updatedAt: lang.updatedAt,
    }, lang.id));
  }

  async findActive(): Promise<Language[]> {
    const languages = await this.prisma.language.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return languages.map(lang => Language.create({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName || undefined,
      country: lang.country || undefined,
      isActive: lang.isActive,
      createdAt: lang.createdAt,
      updatedAt: lang.updatedAt,
    }, lang.id));
  }

  async findById(id: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { id }
    });

    if (!language) return null;

    return Language.create({
      code: language.code,
      name: language.name,
      nativeName: language.nativeName || undefined,
      country: language.country || undefined,
      isActive: language.isActive,
      createdAt: language.createdAt,
      updatedAt: language.updatedAt,
    }, language.id);
  }

  async findByCode(code: string): Promise<Language | null> {
    const language = await this.prisma.language.findUnique({
      where: { code }
    });

    if (!language) return null;

    return Language.create({
      code: language.code,
      name: language.name,
      nativeName: language.nativeName || undefined,
      country: language.country || undefined,
      isActive: language.isActive,
      createdAt: language.createdAt,
      updatedAt: language.updatedAt,
    }, language.id);
  }
}
