import { 
  Controller, 
  Get, 
  Query, 
  UseGuards, 
  Request,
  Inject 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiQuery,
  ApiBearerAuth 
} from '@nestjs/swagger';
import { GetNavigationUseCase } from '../../application/use-cases/get-navigation.use-case';
import { NavigationResponseDto } from '../../application/dtos/navigation-response.dto';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';
import { GetProfileUseCase } from '../../../auth/application/use-cases/get-profile.use-case';

@ApiTags('Navigation')
@Controller('navigation')
export class NavigationController {
  constructor(
    private readonly getNavigationUseCase: GetNavigationUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
  ) {}

  @Get('sidebar')
  @ApiOperation({ 
    summary: 'Obtener elementos del sidebar',
    description: 'Devuelve los elementos de navegación del sidebar en el formato solicitado'
  })
  @ApiQuery({ 
    name: 'role', 
    required: false, 
    description: 'Rol del usuario para filtrar la navegación (ADMIN, USER, MODERATOR)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Elementos del sidebar obtenidos exitosamente',
    type: NavigationResponseDto,
    schema: {
      example: {
        message: "Navegación obtenida exitosamente",
        navItems: [
          { icon: "home", name: "Inicio", ruta: "/" },
          { icon: "shopping_bag", name: "Productos", ruta: "/product" },
          { icon: "person", name: "Perfil", ruta: "/profile" },
          { icon: "settings", name: "Configuración", ruta: "/settings" }
        ],
        userRole: "ADMIN"
      }
    }
  })
  async getSidebar(@Query('role') role?: string): Promise<NavigationResponseDto> {
    const navItems = await this.getNavigationUseCase.execute(role);
    console.log(role,'rol del usuario');
    return {
      message: "Navegación obtenida exitosamente",
      navItems,
      ...(role && { userRole: role })
    };
  }

  @Get('sidebar/authenticated')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener sidebar para usuario autenticado',
    description: 'Devuelve los elementos de navegación según el rol del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Navegación personalizada obtenida exitosamente',
    type: NavigationResponseDto,
    schema: {
      example: {
        message: "Navegación obtenida exitosamente",
        navItems: [
          { icon: "home", name: "Inicio", ruta: "/" },
          { icon: "shopping_bag", name: "Productos", ruta: "/product" },
          { icon: "person", name: "Perfil", ruta: "/profile" },
          { icon: "settings", name: "Configuración", ruta: "/settings" }
        ],
        userRole: "ADMIN"
      }
    }
  })
  async getAuthenticatedSidebar(@Request() req: any): Promise<NavigationResponseDto> {
    // El req.user viene de Supabase y no tiene el rol de la BD local
    // Necesitamos obtener el rol desde el perfil del usuario
    const supabaseUuid = req.user?.id;
    console.log('🔍 Navigation: Usuario autenticado', { 
      supabaseUuid, 
      email: req.user?.email,
      userFromSupabase: !!req.user 
    });

    let userRole = 'USER'; // Valor por defecto

    if (supabaseUuid) {
      try {
        // Obtener el perfil del usuario para conseguir su rol
        const profileData = await this.getProfileUseCase.execute(supabaseUuid);
        userRole = profileData.user.role;
        
        console.log('✅ Navigation: Rol obtenido desde el perfil', { 
          userRole, 
          userId: profileData.user.id,
          company: profileData.company.name,
          totalCompanies: profileData.totalCompanies
        });
      } catch (error) {
        console.log('❌ Navigation: Error obteniendo rol del usuario:', error.message);
        console.log('⚠️ Navigation: Usando rol por defecto USER');
      }
    }

    const navItems = await this.getNavigationUseCase.execute(userRole);
    
    return {
      message: "Navegación obtenida exitosamente",
      navItems,
      userRole
    };
  }

  @Get('all')
  @ApiOperation({ 
    summary: 'Obtener toda la navegación',
    description: 'Devuelve todos los elementos de navegación sin filtros'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Toda la navegación obtenida exitosamente',
    type: NavigationResponseDto
  })
  async getAllNavigation(): Promise<NavigationResponseDto> {
    const navItems = await this.getNavigationUseCase.execute();
    
    return {
      message: "Navegación obtenida exitosamente",
      navItems
    };
  }
}
