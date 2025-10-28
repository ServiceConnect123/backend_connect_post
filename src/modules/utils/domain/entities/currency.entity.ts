export class Currency {
  constructor(
    public readonly id: string,
    public readonly code: string, // "COP", "USD", "EUR"
    public readonly name: string, // "Colombian Peso", "US Dollar"
    public readonly symbol: string, // "$", "€"
    public readonly country: string, // "Colombia", "United States"
    public readonly type: string, // "Pesos", "Dollars", "Euros"
    public readonly decimalPlaces: number = 2,
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    code: string;
    name: string;
    symbol: string;
    country: string;
    type: string;
    decimalPlaces?: number;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }, id?: string): Currency {
    return new Currency(
      id || crypto.randomUUID(),
      props.code,
      props.name,
      props.symbol,
      props.country,
      props.type,
      props.decimalPlaces ?? 2,
      props.isActive ?? true,
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
    );
  }

  toJSON() {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      symbol: this.symbol,
      country: this.country,
      type: this.type,
      decimalPlaces: this.decimalPlaces,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
