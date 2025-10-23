import { UserConfiguration } from '../entities/user-configuration.entity';

export interface UserConfigurationRepository {
  findByUserId(userId: string): Promise<UserConfiguration | null>;
  findBySupabaseUuid(supabaseUuid: string): Promise<UserConfiguration | null>;
  create(configuration: UserConfiguration): Promise<UserConfiguration>;
  update(configuration: UserConfiguration): Promise<UserConfiguration>;
  delete(id: string): Promise<void>;
  createDefaultConfiguration(userId: string): Promise<UserConfiguration>;
}
