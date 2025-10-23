import { Injectable, Inject } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly supabaseAuthService: SupabaseAuthService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

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

    // Get the user's selected company
    let selectedCompany: any = null;
    try {
      if (result.user?.id) {
        const selectedCompanyData = await this.userRepository.findSelectedCompany(result.user.id);
        if (selectedCompanyData) {
          selectedCompany = {
            id: selectedCompanyData.company.id,
            name: selectedCompanyData.company.name,
            nit: selectedCompanyData.company.nit,
            email: selectedCompanyData.company.email,
            phone: selectedCompanyData.company.phone,
            address: selectedCompanyData.company.address,
            countryId: selectedCompanyData.company.countryId,
            cityId: selectedCompanyData.company.cityId,
            createdAt: selectedCompanyData.company.createdAt,
            updatedAt: selectedCompanyData.company.updatedAt,
          };
        }
      }
    } catch (error) {
      console.warn('Could not fetch selected company during login:', error.message);
      // Continue with login even if company fetch fails
    }

    const response: any = {
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

    if (selectedCompany) {
      response.company = selectedCompany;
    }

    return response;
  }
}
