import { Injectable, Inject } from '@nestjs/common';
import { RegisterDto } from '../dtos/register.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import { User } from '../../domain/entities/user.entity';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY_TOKEN } from '../../domain/repositories/company.repository.token';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly supabaseAuthService: SupabaseAuthService,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(registerDto: RegisterDto) {
    // 1. Crear el usuario en Supabase Auth
    const authResult = await this.supabaseAuthService.signUp({
      email: registerDto.email,
      password: registerDto.password,
      name: `${registerDto.first_name} ${registerDto.last_name}`,
    });

    if (authResult.error) {
      throw new UnauthorizedException(authResult.error.message);
    }

    if (!authResult.user) {
      throw new UnauthorizedException('Failed to create user in authentication service');
    }

    try {
      let companyId = registerDto.company_id;

      // 2. Crear la empresa si no se proporciona company_id
      if (!companyId) {
        const company = Company.create({
          name: registerDto.company.name,
          nit: registerDto.company.nit,
          email: registerDto.company.email,
          phone: registerDto.company.phone,
          address: registerDto.company.address,
          countryId: registerDto.company.countryId,
          cityId: registerDto.company.cityId,
        });

        const savedCompany = await this.companyRepository.create(company);
        companyId = savedCompany.id;
      }

      // 3. Crear el usuario en la base de datos
      const user = User.create({
        supabaseUuid: authResult.user.id,
        email: registerDto.email,
        firstName: registerDto.first_name,
        lastName: registerDto.last_name,
        role: registerDto.role,
        companyId: companyId!,
      });

      const savedUser = await this.userRepository.create(user);

      return {
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: savedUser.id,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          role: savedUser.role,
          companyId: savedUser.companyId,
        },
      };
    } catch (error) {
      // If database creation fails, log the error
      // Note: Supabase user will remain but without corresponding database record
      console.error('Failed to create user in database:', error);
      throw error;
    }
  }
}
