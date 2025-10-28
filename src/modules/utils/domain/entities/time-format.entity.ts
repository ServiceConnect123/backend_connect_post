export class TimeFormat {
  constructor(
    public readonly id: string,
    public readonly value: string, // "12h", "24h"
    public readonly name: string, // "12 Hours", "24 Hours"
    public readonly description?: string,
    public readonly isActive: boolean = true,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  static create(props: {
    value: string;
    name: string;
    description?: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }, id?: string): TimeFormat {
    return new TimeFormat(
      id || crypto.randomUUID(),
      props.value,
      props.name,
      props.description,
      props.isActive ?? true,
      props.createdAt || new Date(),
      props.updatedAt || new Date(),
    );
  }

  toJSON() {
    return {
      id: this.id,
      value: this.value,
      name: this.name,
      description: this.description,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
