import { Injectable, Inject } from '@nestjs/common';
import type { UserRepository } from '../repositories/user.repository';
import { USER_REPOSITORY_TOKEN } from '../repositories/user.repository.token';
import { EncryptionService } from '../../../../shared/infrastructure/services/encryption.service';
import { JwtTokenService, JwtPayload } from '../../infrastructure/services/jwt-token.service';
import { UnauthorizedException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';

@Injectable()
export class AuthDomainService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN) private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async authenticate(email: string, password: string): Promise<{ token: string; user: any }> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.encryptionService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };

    const token = this.jwtTokenService.generateToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }
}
