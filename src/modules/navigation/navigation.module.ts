import { Module } from '@nestjs/common';
import { NavigationController } from './infrastructure/controllers/navigation.controller';
import { GetNavigationUseCase } from './application/use-cases/get-navigation.use-case';
import { NavigationRepositoryImpl } from './infrastructure/repositories/navigation.repository.impl';
import { NAVIGATION_REPOSITORY_TOKEN } from './domain/repositories/navigation.repository.token';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [NavigationController],
  providers: [
    GetNavigationUseCase,
    {
      provide: NAVIGATION_REPOSITORY_TOKEN,
      useClass: NavigationRepositoryImpl,
    },
  ],
  exports: [GetNavigationUseCase, NAVIGATION_REPOSITORY_TOKEN],
})
export class NavigationModule {}
