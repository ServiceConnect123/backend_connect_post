import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { jwtConfig } from './infrastructure/config/jwt.config';
import { PrismaService } from './infrastructure/database/prisma.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: jwtConfig.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [JwtAuthGuard, PrismaService],
  exports: [JwtModule, JwtAuthGuard, PrismaService],
})
export class SharedModule {}
