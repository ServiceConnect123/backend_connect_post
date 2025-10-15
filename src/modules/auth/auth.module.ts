import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { GetProfileUseCase } from './application/use-cases/get-profile.use-case';
import { SupabaseAuthService } from './infrastructure/services/supabase-auth.service';
import { SupabaseAuthGuard } from '../../shared/infrastructure/guards/supabase-auth.guard';
import { USER_REPOSITORY_TOKEN } from './domain/repositories/user.repository.token';
import { UserRepositoryImpl } from './infrastructure/repositories/user.repository.impl';
import { COMPANY_REPOSITORY_TOKEN } from './domain/repositories/company.repository.token';
import { SharedModule } from '../../shared/shared.module';
import { LocationsModule } from '../locations/locations.module';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { CompanyPrismaRepository } from './infrastructure/repositories/company.repository.impl';

@Module({
  imports: [SharedModule, LocationsModule],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    GetProfileUseCase,
    SupabaseAuthService,
    SupabaseAuthGuard,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: COMPANY_REPOSITORY_TOKEN,
      useClass: CompanyPrismaRepository,
    },
  ],
  exports: [SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule {}
