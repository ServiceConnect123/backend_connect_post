export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(data: {
    id: string;
    email: string;
    password: string;
    name: string;
  }): User {
    return new User(data.id, data.email, data.password, data.name);
  }
}
