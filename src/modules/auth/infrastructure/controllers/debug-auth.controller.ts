import { Controller, Get, Request, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';

@ApiTags('Debug Authentication')
@Controller('debug-auth')
export class DebugAuthController {
  
  @Get('test-token')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Probar extracción de token',
    description: 'Endpoint para debuggear qué usuario se está extrayendo del token JWT'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario extraída del token'
  })
  async testToken(@Request() req: any, @Headers() headers: any) {
    const user = req.user;
    
    return {
      message: 'Token procesado exitosamente',
      debug: {
        user: user,
        userKeys: user ? Object.keys(user) : null,
        supabaseUuid: user?.id || user?.sub || 'No encontrado',
        email: user?.email || 'No encontrado',
        headers: {
          authorization: headers.authorization ? 
            `Bearer ${headers.authorization.substring(7, 20)}...` : 
            'No Authorization header',
        },
        rawUser: JSON.stringify(user, null, 2),
      }
    };
  }

  @Get('no-auth')
  @ApiOperation({ 
    summary: 'Endpoint sin autenticación',
    description: 'Endpoint de control sin guard de autenticación'
  })
  async noAuth(@Headers() headers: any) {
    return {
      message: 'Endpoint sin autenticación funcionando',
      headers: {
        authorization: headers.authorization ? 
          `Bearer ${headers.authorization.substring(7, 20)}...` : 
          'No Authorization header',
        userAgent: headers['user-agent'] || 'No User-Agent',
      }
    };
  }

  @Get('raw-headers')
  @ApiOperation({ 
    summary: 'Ver headers raw',
    description: 'Mostrar todos los headers recibidos'
  })
  async rawHeaders(@Headers() headers: any) {
    return {
      message: 'Headers raw',
      headers: headers,
      authHeader: headers.authorization,
      hasBearer: headers.authorization?.startsWith('Bearer '),
      tokenLength: headers.authorization ? headers.authorization.length : 0,
    };
  }
}
