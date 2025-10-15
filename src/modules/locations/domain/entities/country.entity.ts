import { BaseEntity } from '../../../../shared/domain/entities/entity.base';

export interface CountryProps {
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Country extends BaseEntity<CountryProps> {
  constructor(props: CountryProps, id?: string) {
    super(props, id);
  }

  get key(): string {
    return this.props.key;
  }

  get value(): string {
    return this.props.value;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: CountryProps, id?: string): Country {
    return new Country(props, id);
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      value: this.value,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
