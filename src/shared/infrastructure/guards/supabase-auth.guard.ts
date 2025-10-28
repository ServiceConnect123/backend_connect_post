import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { SupabaseAuthService } from '../../../modules/auth/infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../exceptions/domain.exceptions';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    console.log('🔍 SupabaseAuthGuard - Processing request');
    console.log('   Auth header present:', !!authHeader);
    console.log('   Starts with Bearer:', authHeader?.startsWith('Bearer '));

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ SupabaseAuthGuard - No valid authorization header');
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.substring(7);
    console.log('   Token length:', token.length);
    console.log('   Token preview:', token.substring(0, 20) + '...');
    
    try {
      const { user, error } = await this.supabaseAuthService.getUser(token);
      
      console.log('   Supabase response - Error:', !!error);
      console.log('   Supabase response - User:', !!user);
      
      if (user) {
        console.log('   User ID:', user.id);
        console.log('   User email:', user.email);
        console.log('   User keys:', Object.keys(user));
      }
      
      if (error || !user) {
        console.log('❌ SupabaseAuthGuard - Invalid token or user not found');
        console.log('   Error details:', error);
        throw new UnauthorizedException('Invalid token');
      }

      request.user = user;
      console.log('✅ SupabaseAuthGuard - User authenticated successfully');
      return true;
    } catch (error) {
      console.log('❌ SupabaseAuthGuard - Exception occurred:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
