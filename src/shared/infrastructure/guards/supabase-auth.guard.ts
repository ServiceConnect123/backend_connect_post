import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { SupabaseAuthService } from '../../../modules/auth/infrastructure/services/supabase-auth.service';
import { UnauthorizedException } from '../exceptions/domain.exceptions';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly supabaseAuthService: SupabaseAuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token not provided');
    }

    const token = authHeader.substring(7);
    
    try {
      const { user, error } = await this.supabaseAuthService.getUser(token);
      
      if (error || !user) {
        throw new UnauthorizedException('Invalid token');
      }

      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
