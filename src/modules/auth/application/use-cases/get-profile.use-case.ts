import { Injectable, Inject } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import type { UserRepository } from '../../domain/repositories/user.repository';
import type { CompanyRepository } from '../../domain/repositories/company.repository';
import { COMPANY_REPOSITORY_TOKEN } from '../../domain/repositories/company.repository.token';

@Injectable()
export class GetProfileUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
    @Inject(COMPANY_REPOSITORY_TOKEN)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute(supabaseUuid: string) {
    // Buscar el usuario por su UUID de Supabase
    const user = await this.userRepository.findBySupabaseUuid(supabaseUuid);
    
    if (!user) {
      throw new Error('User not found in database');
    }

    // Buscar la información de la empresa
    const company = await this.companyRepository.findById(user.companyId);

    if (!company) {
      throw new Error('Company not found');
    }

    return {
      user: {
        id: user.id,
        supabaseUuid: user.supabaseUuid,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      company: {
        id: company.id,
        name: company.name,
        nit: company.nit,
        email: company.email,
        phone: company.phone,
        address: company.address,
        country: company.country,
        city: company.city,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt,
      }
    };
  }
}
