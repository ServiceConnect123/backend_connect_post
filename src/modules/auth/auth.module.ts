import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { SupabaseAuthService } from './infrastructure/services/supabase-auth.service';
import { SupabaseAuthGuard } from '../../shared/infrastructure/guards/supabase-auth.guard';

@Module({
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    RegisterUseCase,
    SupabaseAuthService,
    SupabaseAuthGuard,
  ],
  exports: [SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule {}
