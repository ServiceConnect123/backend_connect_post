import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async execute(registerDto: RegisterDto) {
    const result = await this.supabaseAuthService.signUp({
      email: registerDto.email,
      password: registerDto.password,
      name: registerDto.name,
    });

    if (result.error) {
      throw new UnauthorizedException(result.error.message);
    }

    return {
      message: 'User registered successfully. Please check your email for verification.',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.user_metadata?.name,
        emailConfirmed: result.user?.email_confirmed_at !== null,
      },
      session: result.session ? {
        accessToken: result.session.access_token,
        refreshToken: result.session.refresh_token,
        expiresAt: result.session.expires_at,
      } : null,
    };
  }
}
