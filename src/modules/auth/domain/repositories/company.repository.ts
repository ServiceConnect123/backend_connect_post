import { Company } from '../entities/company.entity';

export interface CompanyRepository {
  findById(id: string): Promise<Company | null>;
  findByNit(nit: string): Promise<Company | null>;
  create(company: Company): Promise<Company>;
  update(company: Company): Promise<Company>;
  delete(id: string): Promise<void>;
}

export const COMPANY_REPOSITORY_TOKEN = Symbol('CompanyRepository');
