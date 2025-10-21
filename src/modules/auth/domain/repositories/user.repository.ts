import { User, UserRole } from '../entities/user.entity';
import { UserCompany } from '../entities/user-company.entity';
import { Company } from '../entities/company.entity';

export interface UserCompanyAssociation {
  user: User;
  company: Company;
  role: UserRole;
  userCompanyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRepository {
  // User methods
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findBySupabaseUuid(supabaseUuid: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;

  // UserCompany methods
  findUserCompanyByUserAndCompany(userId: string, companyId: string): Promise<UserCompany | null>;
  findUserCompaniesByUserId(userId: string): Promise<UserCompany[]>;
  findUserCompaniesBySupabaseUuid(supabaseUuid: string): Promise<UserCompanyAssociation[]>;
  createUserCompany(userCompany: UserCompany): Promise<UserCompany>;
  updateUserCompany(userCompany: UserCompany): Promise<UserCompany>;
  deleteUserCompany(id: string): Promise<void>;

  // Combined methods for convenience
  findUserWithCompanies(supabaseUuid: string): Promise<{ user: User; companies: UserCompanyAssociation[] } | null>;
  findUserCompanyAssociation(supabaseUuid: string, companyId: string): Promise<UserCompanyAssociation | null>;
}
