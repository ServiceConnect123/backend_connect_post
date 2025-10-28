export class Language {
  constructor(
    public readonly id: string,
    public readonly code: string, // "es", "en", "pt"
    public readonly name: string, // "Spanish", "English"
    public readonly nativeName?: string, // "Español", "English"
    public readonly country?: string, // "Colombia", "United States"
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    code: string;
    name: string;
    nativeName?: string;
    country?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }, id?: string): Language {
    return new Language(
      id || crypto.randomUUID(),
      props.code,
      props.name,
      props.nativeName,
      props.country,
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
      nativeName: this.nativeName,
      country: this.country,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
