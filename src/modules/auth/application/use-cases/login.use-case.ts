import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';

@Injectable()
export class LoginUseCase {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async execute(loginDto: LoginDto) {
    const result = await this.supabaseAuthService.signIn({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (result.error) {
      throw new UnauthorizedException(result.error.message);
    }

    if (!result.session) {
      throw new UnauthorizedException('Login failed - no session created');
    }

    return {
      message: 'Login successful',
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.user_metadata?.name || result.user?.email?.split('@')[0],
        emailConfirmed: result.user?.email_confirmed_at !== null,
      },
      session: {
        accessToken: result.session.access_token,
        refreshToken: result.session.refresh_token,
        expiresAt: result.session.expires_at,
      },
    };
  }
}
