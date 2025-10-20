import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';

export interface UserCompanyAssociation {
  user: User;
  company: Company;
}

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findBySupabaseUuid(supabaseUuid: string): Promise<User | null>;
  findBySupabaseUuidAndCompanyId(supabaseUuid: string, companyId: string): Promise<User | null>;
  findCompaniesBySupabaseUuid(supabaseUuid: string): Promise<Company[]>;
  findUserCompanyAssociationsBySupabaseUuid(supabaseUuid: string): Promise<{ user: User; company: Company; }[]>;
  save(user: User): Promise<User>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
