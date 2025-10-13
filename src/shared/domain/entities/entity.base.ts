export abstract class Entity<T> {
  protected readonly _id: T;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: T) {
    this._id = id;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): T {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  equals(entity: Entity<T>): boolean {
    return this._id === entity._id;
  }
}

export abstract class BaseEntity<TProps> {
  protected readonly _id: string;
  protected _props: TProps;

  constructor(props: TProps, id?: string) {
    this._id = id || this.generateId();
    this._props = props;
  }

  get id(): string {
    return this._id;
  }

  get props(): TProps {
    return this._props;
  }

  private generateId(): string {
    // Simple UUID v4 generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  equals(entity: BaseEntity<TProps>): boolean {
    return this._id === entity._id;
  }
}
