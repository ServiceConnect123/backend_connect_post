import { Injectable } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: any;
  session: any;
  error?: AuthError | null;
}

@Injectable()
export class MockSupabaseAuthService {
  // In-memory user storage for testing
  private users: Array<{
    id: string;
    email: string;
    password: string;
    name?: string;
    email_confirmed_at?: string;
    created_at: string;
  }> = [
    {
      id: 'admin-user-id',
      email: 'admin@example.com',
      password: 'password123',
      name: 'Admin User',
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
  ];

  async signUp(data: SignUpData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === data.email);
    if (existingUser) {
      return {
        user: null,
        session: null,
        error: {
          message: 'User already registered',
          status: 400,
        } as AuthError,
      };
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password, // In real implementation, this would be hashed
      name: data.name,
      email_confirmed_at: new Date().toISOString(), // Auto-confirm for testing
      created_at: new Date().toISOString(),
    };

    this.users.push(newUser);

    // Generate mock session
    const session = {
      access_token: `mock-jwt-${newUser.id}-${Date.now()}`,
      refresh_token: `mock-refresh-${newUser.id}-${Date.now()}`,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: {
          name: newUser.name,
        },
        email_confirmed_at: newUser.email_confirmed_at,
        created_at: newUser.created_at,
      },
    };

    return {
      user: session.user,
      session,
      error: null,
    };
  }

  async signInWithPassword(data: SignInData): Promise<AuthResponse> {
    // Find user
    const user = this.users.find(u => u.email === data.email);
    if (!user || user.password !== data.password) {
      return {
        user: null,
        session: null,
        error: {
          message: 'Invalid login credentials',
          status: 400,
        } as AuthError,
      };
    }

    // Generate mock session
    const session = {
      access_token: `mock-jwt-${user.id}-${Date.now()}`,
      refresh_token: `mock-refresh-${user.id}-${Date.now()}`,
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
        },
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
      },
    };

    return {
      user: session.user,
      session,
      error: null,
    };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    // Mock successful logout
    return { error: null };
  }

  async getUser(accessToken: string): Promise<{ user: any; error: AuthError | null }> {
    // Extract user ID from mock token
    const tokenParts = accessToken.split('-');
    if (tokenParts.length < 3 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt') {
      return {
        user: null,
        error: {
          message: 'Invalid token',
          status: 401,
        } as AuthError,
      };
    }

    const userId = tokenParts[2];
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return {
        user: null,
        error: {
          message: 'User not found',
          status: 404,
        } as AuthError,
      };
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
        },
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
      },
      error: null,
    };
  }

  async resetPasswordForEmail(email: string): Promise<{ error: AuthError | null }> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return {
        error: {
          message: 'User not found',
          status: 404,
        } as AuthError,
      };
    }

    // Mock successful password reset email sent
    console.log(`Mock: Password reset email sent to ${email}`);
    return { error: null };
  }

  async updateUser(accessToken: string, attributes: { password?: string }): Promise<{ user: any; error: AuthError | null }> {
    // Extract user ID from mock token
    const tokenParts = accessToken.split('-');
    if (tokenParts.length < 3 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt') {
      return {
        user: null,
        error: {
          message: 'Invalid token',
          status: 401,
        } as AuthError,
      };
    }

    const userId = tokenParts[2];
    const userIndex = this.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return {
        user: null,
        error: {
          message: 'User not found',
          status: 404,
        } as AuthError,
      };
    }

    // Update user password
    if (attributes.password) {
      this.users[userIndex].password = attributes.password;
    }

    const user = this.users[userIndex];
    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
        },
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
      },
      error: null,
    };
  }
}
