import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { jwtConfig } from './infrastructure/config/jwt.config';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class SharedModule {}
