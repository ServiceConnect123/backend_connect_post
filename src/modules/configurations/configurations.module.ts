import { Module } from '@nestjs/common';
import { ConfigurationsController } from './infrastructure/controllers/configurations.controller';
import { GetUserPreferencesUseCase } from './application/use-cases/get-user-preferences.use-case';
import { UpdateUserPreferencesUseCase } from './application/use-cases/update-user-preferences.use-case';
import { USER_CONFIGURATION_REPOSITORY_TOKEN } from './domain/repositories/user-configuration.repository.token';
import { UserConfigurationRepositoryImpl } from './infrastructure/repositories/user-configuration.repository.impl';
import { SharedModule } from '../../shared/shared.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [ConfigurationsController],
  providers: [
    GetUserPreferencesUseCase,
    UpdateUserPreferencesUseCase,
    {
      provide: USER_CONFIGURATION_REPOSITORY_TOKEN,
      useClass: UserConfigurationRepositoryImpl,
    },
  ],
  exports: [
    GetUserPreferencesUseCase,
    UpdateUserPreferencesUseCase,
  ],
})
export class ConfigurationsModule {}
