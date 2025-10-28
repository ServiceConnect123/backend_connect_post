import { Injectable, Inject } from '@nestjs/common';
import { TIME_FORMAT_REPOSITORY_TOKEN } from '../../domain/repositories/time-format.repository.token';
import type { TimeFormatRepository } from '../../domain/repositories/time-format.repository';

@Injectable()
export class GetTimeFormatsUseCase {
  constructor(
    @Inject(TIME_FORMAT_REPOSITORY_TOKEN) private readonly timeFormatRepository: TimeFormatRepository,
  ) {}

  async execute() {
    console.log('🕐 Getting all available time formats');

    const timeFormats = await this.timeFormatRepository.findActive();

    return {
      message: 'Formatos de tiempo obtenidos exitosamente',
      timeFormats: timeFormats.map(tf => ({
        id: tf.id,
        value: tf.value,
        name: tf.name,
        description: tf.description,
      })),
      total: timeFormats.length
    };
  }
}
