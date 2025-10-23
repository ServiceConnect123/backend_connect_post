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

  async execute(supabaseUuid: string, companyId?: string) {
    console.log('🔍 GetProfileUseCase: Starting profile retrieval', { supabaseUuid, companyId });

    // Get all user-company associations for this user
    const userCompanies = await this.userRepository.findUserCompaniesBySupabaseUuid(supabaseUuid);
    
    if (!userCompanies || userCompanies.length === 0) {
      console.log('❌ GetProfileUseCase: No user found for Supabase UUID:', supabaseUuid);
      throw new Error('User not found in database');
    }

    console.log(`📊 GetProfileUseCase: Found ${userCompanies.length} company association(s) for user`);

    // If companyId is provided, find the specific user-company combination
    let targetAssociation;
    let targetRole;

    if (companyId) {
      console.log('🎯 GetProfileUseCase: Looking for specific company context:', companyId);
      targetAssociation = userCompanies.find(uc => uc.company.id === companyId);
      
      if (!targetAssociation) {
        throw new Error('User not found in specified company context');
      }
      
      targetRole = targetAssociation.role;
    } else {
      // No specific company requested - use the selected company or first one
      console.log('📋 GetProfileUseCase: No specific company requested, checking for selected company');
      
      // Try to get the selected company
      const selectedCompany = await this.userRepository.findSelectedCompany(supabaseUuid);
      
      if (selectedCompany) {
        console.log('✅ GetProfileUseCase: Using selected company:', selectedCompany.company.name);
        targetAssociation = selectedCompany;
        targetRole = selectedCompany.role;
      } else {
        console.log('📋 GetProfileUseCase: No selected company, using first association');
        targetAssociation = userCompanies[0];
        targetRole = targetAssociation.role;
      }
    }

    // Get all companies for the complete profile
    const allCompanies = userCompanies.map(uc => ({
      id: uc.company.id,
      name: uc.company.name,
      nit: uc.company.nit,
      email: uc.company.email,
      phone: uc.company.phone,
      address: uc.company.address,
      countryId: uc.company.countryId,
      cityId: uc.company.cityId,
      role: uc.role, // User's role in this specific company
      userCompanyId: uc.userCompanyId,
      userCreatedAt: uc.createdAt, // When user was added to this company
    }));

    const result = {
      user: {
        id: targetAssociation.user.id,
        supabaseUuid: targetAssociation.user.supabaseUuid,
        email: targetAssociation.user.email,
        firstName: targetAssociation.user.firstName,
        lastName: targetAssociation.user.lastName,
        fullName: targetAssociation.user.fullName,
        phone: targetAssociation.user.phone,
        documentType: targetAssociation.user.documentType,
        documentNumber: targetAssociation.user.documentNumber,
        role: targetRole, // Role in the current company context
        createdAt: targetAssociation.user.createdAt,
        updatedAt: targetAssociation.user.updatedAt,
      },
      // Primary company (for backward compatibility)
      company: {
        id: targetAssociation.company.id,
        name: targetAssociation.company.name,
        nit: targetAssociation.company.nit,
        email: targetAssociation.company.email,
        phone: targetAssociation.company.phone,
        address: targetAssociation.company.address,
        countryId: targetAssociation.company.countryId,
        cityId: targetAssociation.company.cityId,
        createdAt: targetAssociation.company.createdAt,
        updatedAt: targetAssociation.company.updatedAt,
      },
      // All companies the user is associated with (new for multi-company support)
      companies: allCompanies,
      // Multi-company context info
      isMultiCompany: allCompanies.length > 1,
      totalCompanies: allCompanies.length,
    };

    console.log('✅ GetProfileUseCase: Profile retrieved successfully', {
      userId: targetAssociation.user.id,
      primaryCompany: targetAssociation.company.name,
      totalCompanies: allCompanies.length,
    });

    return result;
  }
}
