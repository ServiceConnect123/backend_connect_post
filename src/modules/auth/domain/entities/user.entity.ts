import { BaseEntity } from '../../../../shared/domain/entities/entity.base';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  MODERATOR = 'MODERATOR',
}

export interface UserProps {
  supabaseUuid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User extends BaseEntity<UserProps> {
  constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  get supabaseUuid(): string {
    return this.props.supabaseUuid;
  }

  get email(): string {
    return this.props.email;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get companyId(): string {
    return this.props.companyId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }

  toJSON() {
    return {
      id: this.id,
      supabaseUuid: this.supabaseUuid,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.fullName,
      role: this.role,
      companyId: this.companyId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
