import { Injectable } from '@nestjs/common';
import { UserConfigurationRepository } from '../../domain/repositories/user-configuration.repository';
import { UserConfiguration } from '../../domain/entities/user-configuration.entity';

@Injectable()
export class UserConfigurationRepositoryImpl implements UserConfigurationRepository {
  constructor(private readonly prisma: any) {}

  async findByUserId(userId: string): Promise<UserConfiguration | null> {
    const config = await this.prisma.userConfiguration.findUnique({
      where: { userId },
    });

    if (!config) return null;

    // For now, we'll work with the existing fields and provide mock IDs
    return UserConfiguration.create({
      userId: config.userId,
      dateFormat: config.dateFormat,
      timeFormatId: await this.getTimeFormatIdByValue(config.timeFormat as string),
      languageId: await this.getLanguageIdByCode(config.language as string),
      currencyId: await this.getCurrencyIdByCode(config.currency as string),
      decimalSeparator: config.decimalSeparator,
      itemsPerPage: config.itemsPerPage,
      theme: config.theme,
      primaryColor: config.primaryColor,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      // Include the full related entities
      timeFormat: await this.getTimeFormatByValue(config.timeFormat as string),
      language: await this.getLanguageByCode(config.language as string),
      currency: await this.getCurrencyByCode(config.currency as string),
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
      timeFormatId: await this.getTimeFormatIdByValue(config.timeFormat as string),
      languageId: await this.getLanguageIdByCode(config.language as string),
      currencyId: await this.getCurrencyIdByCode(config.currency as string),
      decimalSeparator: config.decimalSeparator,
      itemsPerPage: config.itemsPerPage,
      theme: config.theme,
      primaryColor: config.primaryColor,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
      // Include the full related entities
      timeFormat: await this.getTimeFormatByValue(config.timeFormat as string),
      language: await this.getLanguageByCode(config.language as string),
      currency: await this.getCurrencyByCode(config.currency as string),
    }, config.id);
  }

  async create(configuration: UserConfiguration): Promise<UserConfiguration> {
    // Convert IDs back to values for storage in the old schema
    const timeFormatValue = configuration.timeFormat?.value || '24h';
    const languageCode = configuration.language?.code || 'es';
    const currencyCode = configuration.currency?.code || 'COP';

    const created = await this.prisma.userConfiguration.create({
      data: {
        userId: configuration.userId,
        dateFormat: configuration.dateFormat,
        timeFormat: timeFormatValue,
        language: languageCode,
        currency: currencyCode,
        decimalSeparator: configuration.decimalSeparator,
        itemsPerPage: configuration.itemsPerPage,
        theme: configuration.theme,
        primaryColor: configuration.primaryColor,
      },
    });

    return UserConfiguration.create({
      userId: created.userId,
      dateFormat: created.dateFormat,
      timeFormatId: await this.getTimeFormatIdByValue(timeFormatValue),
      languageId: await this.getLanguageIdByCode(languageCode),
      currencyId: await this.getCurrencyIdByCode(currencyCode),
      decimalSeparator: created.decimalSeparator,
      itemsPerPage: created.itemsPerPage,
      theme: created.theme,
      primaryColor: created.primaryColor,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
      timeFormat: await this.getTimeFormatByValue(timeFormatValue),
      language: await this.getLanguageByCode(languageCode),
      currency: await this.getCurrencyByCode(currencyCode),
    }, created.id);
  }

  async update(configuration: UserConfiguration): Promise<UserConfiguration> {
    // Convert IDs back to values for storage in the old schema
    const timeFormatValue = configuration.timeFormat?.value || 
      (await this.getTimeFormatById(configuration.timeFormatId!))?.value || '24h';
    const languageCode = configuration.language?.code || 
      (await this.getLanguageById(configuration.languageId!))?.code || 'es';
    const currencyCode = configuration.currency?.code || 
      (await this.getCurrencyById(configuration.currencyId!))?.code || 'COP';

    const updated = await this.prisma.userConfiguration.update({
      where: { id: configuration.id },
      data: {
        dateFormat: configuration.dateFormat,
        timeFormat: timeFormatValue,
        language: languageCode,
        currency: currencyCode,
        decimalSeparator: configuration.decimalSeparator,
        itemsPerPage: configuration.itemsPerPage,
        theme: configuration.theme,
        primaryColor: configuration.primaryColor,
      },
    });

    return UserConfiguration.create({
      userId: updated.userId,
      dateFormat: updated.dateFormat,
      timeFormatId: await this.getTimeFormatIdByValue(timeFormatValue),
      languageId: await this.getLanguageIdByCode(languageCode),
      currencyId: await this.getCurrencyIdByCode(currencyCode),
      decimalSeparator: updated.decimalSeparator,
      itemsPerPage: updated.itemsPerPage,
      theme: updated.theme,
      primaryColor: updated.primaryColor,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      timeFormat: await this.getTimeFormatByValue(timeFormatValue),
      language: await this.getLanguageByCode(languageCode),
      currency: await this.getCurrencyByCode(currencyCode),
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
        timeFormatId: await this.getTimeFormatIdByValue(existingConfig.timeFormat as string),
        languageId: await this.getLanguageIdByCode(existingConfig.language as string),
        currencyId: await this.getCurrencyIdByCode(existingConfig.currency as string),
        decimalSeparator: existingConfig.decimalSeparator,
        itemsPerPage: existingConfig.itemsPerPage,
        theme: existingConfig.theme,
        primaryColor: existingConfig.primaryColor,
        createdAt: existingConfig.createdAt,
        updatedAt: existingConfig.updatedAt,
        timeFormat: await this.getTimeFormatByValue(existingConfig.timeFormat as string),
        language: await this.getLanguageByCode(existingConfig.language as string),
        currency: await this.getCurrencyByCode(existingConfig.currency as string),
      }, existingConfig.id);
    }

    const defaultConfig = UserConfiguration.create({
      userId,
    });

    return await this.create(defaultConfig);
  }

  // Helper methods to work with the utils tables
  private async getTimeFormatIdByValue(value: string): Promise<string | null> {
    const timeFormat = await this.prisma.timeFormat.findFirst({
      where: { value, isActive: true }
    });
    return timeFormat?.id || null;
  }

  private async getLanguageIdByCode(code: string): Promise<string | null> {
    const language = await this.prisma.language.findFirst({
      where: { code, isActive: true }
    });
    return language?.id || null;
  }

  private async getCurrencyIdByCode(code: string): Promise<string | null> {
    const currency = await this.prisma.currency.findFirst({
      where: { code, isActive: true }
    });
    return currency?.id || null;
  }

  private async getTimeFormatByValue(value: string): Promise<any | null> {
    const timeFormat = await this.prisma.timeFormat.findFirst({
      where: { value, isActive: true }
    });
    return timeFormat ? {
      id: timeFormat.id,
      value: timeFormat.value,
      name: timeFormat.name,
      description: timeFormat.description,
    } : null;
  }

  private async getLanguageByCode(code: string): Promise<any | null> {
    const language = await this.prisma.language.findFirst({
      where: { code, isActive: true }
    });
    return language ? {
      id: language.id,
      code: language.code,
      name: language.name,
      nativeName: language.nativeName,
      country: language.country,
    } : null;
  }

  private async getCurrencyByCode(code: string): Promise<any | null> {
    const currency = await this.prisma.currency.findFirst({
      where: { code, isActive: true }
    });
    return currency ? {
      id: currency.id,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      country: currency.country,
      type: currency.type,
      decimalPlaces: currency.decimalPlaces,
    } : null;
  }

  private async getTimeFormatById(id: string): Promise<any | null> {
    const timeFormat = await this.prisma.timeFormat.findUnique({
      where: { id }
    });
    return timeFormat ? {
      id: timeFormat.id,
      value: timeFormat.value,
      name: timeFormat.name,
      description: timeFormat.description,
    } : null;
  }

  private async getLanguageById(id: string): Promise<any | null> {
    const language = await this.prisma.language.findUnique({
      where: { id }
    });
    return language ? {
      id: language.id,
      code: language.code,
      name: language.name,
      nativeName: language.nativeName,
      country: language.country,
    } : null;
  }

  private async getCurrencyById(id: string): Promise<any | null> {
    const currency = await this.prisma.currency.findUnique({
      where: { id }
    });
    return currency ? {
      id: currency.id,
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      country: currency.country,
      type: currency.type,
      decimalPlaces: currency.decimalPlaces,
    } : null;
  }
}
