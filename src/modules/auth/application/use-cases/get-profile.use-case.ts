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
    const userCompanies = await this.userRepository.findUserCompanyAssociationsBySupabaseUuid(supabaseUuid);
    
    if (!userCompanies || userCompanies.length === 0) {
      console.log('❌ GetProfileUseCase: No user found for Supabase UUID:', supabaseUuid);
      throw new Error('User not found in database');
    }

    console.log(`📊 GetProfileUseCase: Found ${userCompanies.length} company association(s) for user`);

    // If companyId is provided, find the specific user-company combination
    let targetUser;
    let targetCompany;

    if (companyId) {
      console.log('🎯 GetProfileUseCase: Looking for specific company context:', companyId);
      const targetAssociation = userCompanies.find(uc => uc.company.id === companyId);
      
      if (!targetAssociation) {
        throw new Error('User not found in specified company context');
      }
      
      targetUser = targetAssociation.user;
      targetCompany = targetAssociation.company;
    } else {
      // No specific company requested - use the first one (for backward compatibility)
      console.log('📋 GetProfileUseCase: No specific company requested, using first association');
      targetUser = userCompanies[0].user;
      targetCompany = userCompanies[0].company;
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
      role: uc.user.role, // User's role in this specific company
      userCreatedAt: uc.user.createdAt, // When user was added to this company
    }));

    const result = {
      user: {
        id: targetUser.id,
        supabaseUuid: targetUser.supabaseUuid,
        email: targetUser.email,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        fullName: targetUser.fullName,
        role: targetUser.role,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt,
      },
      // Primary company (for backward compatibility)
      company: {
        id: targetCompany.id,
        name: targetCompany.name,
        nit: targetCompany.nit,
        email: targetCompany.email,
        phone: targetCompany.phone,
        address: targetCompany.address,
        countryId: targetCompany.countryId,
        cityId: targetCompany.cityId,
        createdAt: targetCompany.createdAt,
        updatedAt: targetCompany.updatedAt,
      },
      // All companies the user is associated with (new for multi-company support)
      companies: allCompanies,
      // Multi-company context info
      isMultiCompany: allCompanies.length > 1,
      totalCompanies: allCompanies.length,
    };

    console.log('✅ GetProfileUseCase: Profile retrieved successfully', {
      userId: targetUser.id,
      primaryCompany: targetCompany.name,
      totalCompanies: allCompanies.length,
    });

    return result;
  }
}
