import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUserCompaniesUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(supabaseUuid: string) {
    console.log(`🔍 Getting companies for user ${supabaseUuid}`);

    try {
      // Get user with all their companies
      const userWithCompanies = await this.userRepository.findUserWithCompanies(supabaseUuid);

      if (!userWithCompanies) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Transform companies data for response
      const companies = userWithCompanies.companies.map(company => ({
        id: company.company.id,
        name: company.company.name,
        nit: company.company.nit,
        email: company.company.email,
        phone: company.company.phone,
        address: company.company.address,
        countryId: company.company.countryId,
        cityId: company.company.cityId,
        createdAt: company.company.createdAt,
        updatedAt: company.company.updatedAt,
        userRole: company.role,
        userCompanyId: company.userCompanyId,
        associatedAt: company.createdAt,
      }));

      // Get the selected company separately
      let selectedCompanyData: any = null;
      try {
        const selected = await this.userRepository.findSelectedCompany(supabaseUuid);
        if (selected) {
          selectedCompanyData = {
            id: selected.company.id,
            name: selected.company.name,
            nit: selected.company.nit,
            email: selected.company.email,
            phone: selected.company.phone,
            address: selected.company.address,
            countryId: selected.company.countryId,
            cityId: selected.company.cityId,
            createdAt: selected.company.createdAt,
            updatedAt: selected.company.updatedAt,
            userRole: selected.role,
            isSelected: true,
          };
        }
      } catch (error) {
        console.warn('Could not fetch selected company:', error.message);
      }

      console.log(`✅ Found ${companies.length} companies for user`);

      return {
        message: 'Compañías obtenidas exitosamente',
        user: {
          id: userWithCompanies.user.id,
          email: userWithCompanies.user.email,
          firstName: userWithCompanies.user.firstName,
          lastName: userWithCompanies.user.lastName,
          fullName: userWithCompanies.user.fullName,
        },
        companies,
        selectedCompany: selectedCompanyData,
        totalCompanies: companies.length,
        isMultiCompany: companies.length > 1,
      };
    } catch (error) {
      console.error('Error getting user companies:', error);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new Error('Error al obtener las compañías del usuario');
    }
  }
}