import { BaseEntity } from '../../../../shared/domain/entities/entity.base';

export interface CityProps {
  key: string;
  value: string;
  countryId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class City extends BaseEntity<CityProps> {
  constructor(props: CityProps, id?: string) {
    super(props, id);
  }

  get key(): string {
    return this.props.key;
  }

  get value(): string {
    return this.props.value;
  }

  get countryId(): string {
    return this.props.countryId;
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  static create(props: CityProps, id?: string): City {
    return new City(props, id);
  }

  toJSON() {
    return {
      id: this.id,
      key: this.key,
      value: this.value,
      countryId: this.countryId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
