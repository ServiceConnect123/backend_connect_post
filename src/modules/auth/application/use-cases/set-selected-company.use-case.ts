import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { USER_REPOSITORY_TOKEN } from '../../domain/repositories/user.repository.token';
import type { UserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class SetSelectedCompanyUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(supabaseUuid: string, companyId: string) {
    console.log(`🔄 Setting selected company for user ${supabaseUuid} to company ${companyId}`);

    try {
      const selectedCompany = await this.userRepository.setSelectedCompany(supabaseUuid, companyId);

      console.log(`✅ Selected company updated successfully`);

      return {
        message: 'Compañía seleccionada actualizada exitosamente',
        selectedCompany: {
          user: {
            id: selectedCompany.user.id,
            email: selectedCompany.user.email,
            firstName: selectedCompany.user.firstName,
            lastName: selectedCompany.user.lastName,
            fullName: selectedCompany.user.fullName,
          },
          company: {
            id: selectedCompany.company.id,
            name: selectedCompany.company.name,
            nit: selectedCompany.company.nit,
            email: selectedCompany.company.email,
            phone: selectedCompany.company.phone,
            address: selectedCompany.company.address,
            countryId: selectedCompany.company.countryId,
            cityId: selectedCompany.company.cityId,
          },
          role: selectedCompany.role,
        }
      };
    } catch (error) {
      console.error('Error setting selected company:', error);
      
      if (error.message === 'User not found') {
        throw new NotFoundException('Usuario no encontrado');
      }
      
      if (error.message === 'User does not have access to this company') {
        throw new ForbiddenException('No tienes acceso a esta compañía');
      }
      
      throw error;
    }
  }
}
