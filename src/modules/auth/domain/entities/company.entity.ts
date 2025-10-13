import { BaseEntity } from '../../../../shared/domain/entities/entity.base';

export interface CompanyProps {
  name: string;
  nit: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Company extends BaseEntity<CompanyProps> {
  constructor(props: CompanyProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get nit(): string {
    return this.props.nit;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string {
    return this.props.phone;
  }

  get address(): string {
    return this.props.address;
  }

  get country(): string {
    return this.props.country;
  }

  get city(): string {
    return this.props.city;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: CompanyProps, id?: string): Company {
    return new Company(props, id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      nit: this.nit,
      email: this.email,
      phone: this.phone,
      address: this.address,
      country: this.country,
      city: this.city,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
