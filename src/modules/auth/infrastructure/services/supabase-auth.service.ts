import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient, AuthError } from '@supabase/supabase-js';

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
export class SupabaseAuthService {
  private readonly supabase: SupabaseClient;
  private readonly useMockMode: boolean;
  private readonly mockUsers: Array<{
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

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;


      this.supabase = createClient(supabaseUrl!, supabaseAnonKey!);
      console.log('🔐 Auth Service: Using REAL Supabase mode');
    
  }

  async signUp(data: SignUpData): Promise<AuthResponse> {
    if (this.useMockMode) {
      return this.mockSignUp(data);
    }

    const { data: authData, error } = await this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name || '',
        },
      },
    });

    return {
      user: authData.user,
      session: authData.session,
      error,
    };
  }

  async signIn(data: SignInData): Promise<AuthResponse> {
    if (this.useMockMode) {
      return this.mockSignIn(data);
    }

    const { data: authData, error } = await this.supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    return {
      user: authData.user,
      session: authData.session,
      error,
    };
  }

  async signOut(): Promise<{ error: AuthError | null }> {
    if (this.useMockMode) {
      return Promise.resolve({ error: null });
    }
    
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  async getUser(accessToken: string): Promise<{ user: any; error: AuthError | null }> {
    console.log('🔍 SupabaseAuthService.getUser called');
    console.log('   Mock mode:', this.useMockMode);
    console.log('   Token length:', accessToken?.length || 0);

    if (this.useMockMode) {
      console.log('   Using mock mode');
      return this.mockGetUser(accessToken);
    }

    console.log('   Calling Supabase auth.getUser...');
    const { data, error } = await this.supabase.auth.getUser(accessToken);
    
    console.log('   Supabase response:');
    console.log('     Error:', error ? error.message : 'None');
    console.log('     User found:', !!data?.user);
    
    if (data?.user) {
      console.log('     User ID:', data.user.id);
      console.log('     User email:', data.user.email);
    }

    return {
      user: data?.user || null,
      error,
    };
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken,
    });

    return {
      user: data?.user,
      session: data?.session,
      error,
    };
  }

  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    if (this.useMockMode) {
      const user = this.mockUsers.find(u => u.email === email);
      if (!user) {
        return Promise.resolve({
          error: {
            message: 'User not found',
            status: 404,
          } as AuthError,
        });
      }
      console.log(`Mock: Password reset email sent to ${email}`);
      return Promise.resolve({ error: null });
    }

    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password`,
    });
    return { error };
  }

  async updatePassword(accessToken: string, newPassword: string): Promise<{ error: AuthError | null }> {
    // Primero establecemos la sesión
    await this.supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: '', // En un caso real, necesitarías el refresh token también
    });

    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    });

    return { error };
  }

  // Mock methods for development/testing
  private mockSignUp(data: SignUpData): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = this.mockUsers.find(user => user.email === data.email);
    if (existingUser) {
      return Promise.resolve({
        user: null,
        session: null,
        error: {
          message: 'User already registered',
          status: 400,
        } as AuthError,
      });
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      password: data.password,
      name: data.name,
      email_confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    this.mockUsers.push(newUser);

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

    return Promise.resolve({
      user: session.user,
      session,
      error: null,
    });
  }

  private mockSignIn(data: SignInData): Promise<AuthResponse> {
    // Find user
    const user = this.mockUsers.find(u => u.email === data.email);
    if (!user || user.password !== data.password) {
      return Promise.resolve({
        user: null,
        session: null,
        error: {
          message: 'Invalid login credentials',
          status: 400,
        } as AuthError,
      });
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

    return Promise.resolve({
      user: session.user,
      session,
      error: null,
    });
  }

  private mockGetUser(accessToken: string): Promise<{ user: any; error: AuthError | null }> {
    // Extract user ID from mock token
    const tokenParts = accessToken.split('-');
    if (tokenParts.length < 3 || tokenParts[0] !== 'mock' || tokenParts[1] !== 'jwt') {
      return Promise.resolve({
        user: null,
        error: {
          message: 'Invalid token',
          status: 401,
        } as AuthError,
      });
    }

    const userId = tokenParts[2];
    const user = this.mockUsers.find(u => u.id === userId);
    
    if (!user) {
      return Promise.resolve({
        user: null,
        error: {
          message: 'User not found',
          status: 404,
        } as AuthError,
      });
    }

    return Promise.resolve({
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
    });
  }
}
