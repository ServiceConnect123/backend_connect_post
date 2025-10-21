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
  phone?: string;
  documentType?: string;
  documentNumber?: string;
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

  get phone(): string | undefined {
    return this.props.phone;
  }

  get documentType(): string | undefined {
    return this.props.documentType;
  }

  get documentNumber(): string | undefined {
    return this.props.documentNumber;
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
      phone: this.phone,
      documentType: this.documentType,
      documentNumber: this.documentNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
