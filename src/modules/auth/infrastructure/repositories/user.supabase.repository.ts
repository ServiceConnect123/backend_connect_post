import { Injectable, OnModuleInit } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../../../../shared/infrastructure/services/encryption.service';

@Injectable()
export class UserSupabaseRepository implements UserRepository, OnModuleInit {
  private prisma: PrismaClient;

  constructor(private readonly encryptionService: EncryptionService) {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
    // Inicializar con usuario por defecto si no existe
    await this.initializeDefaultUser();
  }

  private async initializeDefaultUser() {
    try {
      // Verificar si ya existe el usuario admin
      const existingUser = await this.prisma.user.findUnique({
        where: { email: 'admin@example.com' },
      });

      if (!existingUser) {
        const hashedPassword = await this.encryptionService.hash('password123');
        
        await this.prisma.user.create({
          data: {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
          },
        });
        
        console.log('👤 Default user created in Supabase');
      }
    } catch (error) {
      console.error('Error initializing default user:', error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    return User.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return User.create({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
    });
  }

  async save(user: User): Promise<User> {
    const userData = {
      email: user.email,
      password: user.password,
      name: user.name,
    };

    const savedUser = await this.prisma.user.upsert({
      where: { id: user.id },
      update: userData,
      create: {
        id: user.id,
        ...userData,
      },
    });

    return User.create({
      id: savedUser.id,
      email: savedUser.email,
      password: savedUser.password,
      name: savedUser.name,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
