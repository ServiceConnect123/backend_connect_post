import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../shared/infrastructure/database/prisma.service';
import { TimeFormatRepository } from '../../domain/repositories/time-format.repository';
import { TimeFormat } from '../../domain/entities/time-format.entity';

@Injectable()
export class TimeFormatRepositoryImpl implements TimeFormatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<TimeFormat[]> {
    const timeFormats = await this.prisma.timeFormat.findMany({
      orderBy: { name: 'asc' }
    });

    return timeFormats.map(tf => TimeFormat.create({
      value: tf.value,
      name: tf.name,
      description: tf.description || undefined,
      isActive: tf.isActive,
      createdAt: tf.createdAt,
      updatedAt: tf.updatedAt,
    }, tf.id));
  }

  async findActive(): Promise<TimeFormat[]> {
    const timeFormats = await this.prisma.timeFormat.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    return timeFormats.map(tf => TimeFormat.create({
      value: tf.value,
      name: tf.name,
      description: tf.description || undefined,
      isActive: tf.isActive,
      createdAt: tf.createdAt,
      updatedAt: tf.updatedAt,
    }, tf.id));
  }

  async findById(id: string): Promise<TimeFormat | null> {
    const timeFormat = await this.prisma.timeFormat.findUnique({
      where: { id }
    });

    if (!timeFormat) return null;

    return TimeFormat.create({
      value: timeFormat.value,
      name: timeFormat.name,
      description: timeFormat.description || undefined,
      isActive: timeFormat.isActive,
      createdAt: timeFormat.createdAt,
      updatedAt: timeFormat.updatedAt,
    }, timeFormat.id);
  }

  async findByValue(value: string): Promise<TimeFormat | null> {
    const timeFormat = await this.prisma.timeFormat.findUnique({
      where: { value }
    });

    if (!timeFormat) return null;

    return TimeFormat.create({
      value: timeFormat.value,
      name: timeFormat.name,
      description: timeFormat.description || undefined,
      isActive: timeFormat.isActive,
      createdAt: timeFormat.createdAt,
      updatedAt: timeFormat.updatedAt,
    }, timeFormat.id);
  }
}
