import { BaseEntity } from '../../../../shared/domain/entities/entity.base';
import { UserRole } from './user.entity';

export interface UserCompanyProps {
  userId: string;
  companyId: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserCompany extends BaseEntity<UserCompanyProps> {
  constructor(props: UserCompanyProps, id?: string) {
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: UserCompanyProps, id?: string): UserCompany {
    return new UserCompany(props, id);
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      companyId: this.companyId,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
