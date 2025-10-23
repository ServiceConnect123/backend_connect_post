import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UserConfiguration } from '../../domain/entities/user-configuration.entity';

@Injectable()
export class UserConfigurationRepositoryImpl implements UserConfigurationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<UserConfiguration | null> {
    const config = await this.prisma.userConfiguration.findUnique({
      where: { userId },
    });

    if (!config) return null;

    return UserConfiguration.create({
      userId: config.userId,
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
      language: config.language,
      currency: config.currency,
      decimalSeparator: config.decimalSeparator,
      itemsPerPage: config.itemsPerPage,
      theme: config.theme,
      primaryColor: config.primaryColor,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    }, config.id);
  }

  async findBySupabaseUuid(supabaseUuid: string): Promise<UserConfiguration | null> {
    // First find the user by supabase UUID
    const user = await this.prisma.user.findUnique({
      where: { supabaseUuid },
      include: { configuration: true },
    });

    if (!user) return null;

    // If user exists but no configuration, create default one
    if (!user.configuration) {
      return await this.createDefaultConfiguration(user.id);
    }

    const config = user.configuration;
    return UserConfiguration.create({
      userId: config.userId,
      dateFormat: config.dateFormat,
      timeFormat: config.timeFormat,
      language: config.language,
      currency: config.currency,
      decimalSeparator: config.decimalSeparator,
      itemsPerPage: config.itemsPerPage,
      theme: config.theme,
      primaryColor: config.primaryColor,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    }, config.id);
  }

  async create(configuration: UserConfiguration): Promise<UserConfiguration> {
    const created = await this.prisma.userConfiguration.create({
      data: {
        userId: configuration.userId,
        dateFormat: configuration.dateFormat,
        timeFormat: configuration.timeFormat,
        language: configuration.language,
        currency: configuration.currency,
        decimalSeparator: configuration.decimalSeparator,
        itemsPerPage: configuration.itemsPerPage,
        theme: configuration.theme,
        primaryColor: configuration.primaryColor,
      },
    });

    return UserConfiguration.create({
      userId: created.userId,
      dateFormat: created.dateFormat,
      timeFormat: created.timeFormat,
      language: created.language,
      currency: created.currency,
      decimalSeparator: created.decimalSeparator,
      itemsPerPage: created.itemsPerPage,
      theme: created.theme,
      primaryColor: created.primaryColor,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    }, created.id);
  }

  async update(configuration: UserConfiguration): Promise<UserConfiguration> {
    const updated = await this.prisma.userConfiguration.update({
      where: { id: configuration.id },
      data: {
        dateFormat: configuration.dateFormat,
        timeFormat: configuration.timeFormat,
        language: configuration.language,
        currency: configuration.currency,
        decimalSeparator: configuration.decimalSeparator,
        itemsPerPage: configuration.itemsPerPage,
        theme: configuration.theme,
        primaryColor: configuration.primaryColor,
      },
    });

    return UserConfiguration.create({
      userId: updated.userId,
      dateFormat: updated.dateFormat,
      timeFormat: updated.timeFormat,
      language: updated.language,
      currency: updated.currency,
      decimalSeparator: updated.decimalSeparator,
      itemsPerPage: updated.itemsPerPage,
      theme: updated.theme,
      primaryColor: updated.primaryColor,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }, updated.id);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userConfiguration.delete({
      where: { id },
    });
  }

  async createDefaultConfiguration(userId: string): Promise<UserConfiguration> {
    console.log(`📝 Creating default configuration for user ${userId}`);
    
    // Check if configuration already exists to avoid duplicates
    const existingConfig = await this.prisma.userConfiguration.findUnique({
      where: { userId },
    });

    if (existingConfig) {
      console.log(`⚠️ Configuration already exists for user ${userId}, returning existing one`);
      return UserConfiguration.create({
        userId: existingConfig.userId,
        dateFormat: existingConfig.dateFormat,
        timeFormat: existingConfig.timeFormat,
        language: existingConfig.language,
        currency: existingConfig.currency,
        decimalSeparator: existingConfig.decimalSeparator,
        itemsPerPage: existingConfig.itemsPerPage,
        theme: existingConfig.theme,
        primaryColor: existingConfig.primaryColor,
        createdAt: existingConfig.createdAt,
        updatedAt: existingConfig.updatedAt,
      }, existingConfig.id);
    }

    const defaultConfig = UserConfiguration.create({
      userId,
    });

    return await this.create(defaultConfig);
  }
}
