import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { RegisterDto } from '../dtos/register.dto';
import { SupabaseAuthService } from '../../infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import { COMPANY_REPOSITORY_TOKEN } from '../../domain/repositories/company.repository';
import { User, UserRole } from '../../domain/entities/user.entity';
import { Company } from '../../domain/entities/company.entity';

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
    // Validar que se proporcione company o company_id
    if (!registerDto.company && !registerDto.company_id) {
      throw new BadRequestException('Must provide either company data or company_id');
    }

    if (registerDto.company && registerDto.company_id) {
      throw new BadRequestException('Cannot provide both company data and company_id');
    }

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

    let companyId: string;

    try {
      // 2. Manejar la empresa
      if (registerDto.company) {
        // Verificar si la empresa ya existe por NIT
        const existingCompany = await this.companyRepository.findByNit(registerDto.company.nit);
        if (existingCompany) {
          throw new BadRequestException(`Company with NIT ${registerDto.company.nit} already exists`);
        }

        // Crear nueva empresa
        const newCompany = Company.create({
          name: registerDto.company.name,
          nit: registerDto.company.nit,
          email: registerDto.company.email,
          phone: registerDto.company.phone,
          address: registerDto.company.address,
          country: registerDto.company.country,
          city: registerDto.company.city,
        });

        const savedCompany = await this.companyRepository.create(newCompany);
        companyId = savedCompany.id;
      } else {
        // Verificar que la empresa exista
        const existingCompany = await this.companyRepository.findById(registerDto.company_id!);
        if (!existingCompany) {
          throw new BadRequestException(`Company with ID ${registerDto.company_id} not found`);
        }
        companyId = registerDto.company_id!;
      }

      // 3. Crear el usuario en la base de datos
      const newUser = User.create({
        supabaseUuid: authResult.user.id,
        email: registerDto.email,
        firstName: registerDto.first_name,
        lastName: registerDto.last_name,
        role: registerDto.role,
        companyId: companyId,
      });

      const savedUser = await this.userRepository.create(newUser);

      // 4. Retornar respuesta
      return {
        message: 'User registered successfully. Please check your email for verification.',
        user: {
          id: savedUser.id,
          supabaseUuid: savedUser.supabaseUuid,
          email: savedUser.email,
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          fullName: savedUser.fullName,
          role: savedUser.role,
          companyId: savedUser.companyId,
          emailConfirmed: authResult.user.email_confirmed_at !== null,
        },
        session: authResult.session ? {
          accessToken: authResult.session.access_token,
          refreshToken: authResult.session.refresh_token,
          expiresAt: authResult.session.expires_at,
        } : null,
      };

    } catch (error) {
      // Si algo falla después de crear el usuario en Supabase, limpiamos
      // En un caso real, podrías querer implementar una saga o transacción distribuida
      console.error('Error during registration, cleanup may be needed:', error);
      throw error;
    }
  }
}
