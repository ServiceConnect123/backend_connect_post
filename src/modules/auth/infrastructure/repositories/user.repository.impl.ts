import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private users: User[] = []; // Simulando una base de datos en memoria

  constructor() {
    // Inicializar con usuario por defecto
    this.initializeDefaultUser();
  }

  private async initializeDefaultUser() {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    this.users.push(User.create({
      id: '1',
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User'
    }));
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      this.users[existingIndex] = user;
    } else {
      this.users.push(user);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const index = this.users.findIndex(u => u.id === id);
    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
}
