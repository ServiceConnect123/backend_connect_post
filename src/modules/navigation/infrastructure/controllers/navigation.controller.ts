import { 
  Controller, 
  Get, 
  Query, 
  UseGuards, 
  Request 
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

@ApiTags('Navigation')
@Controller('navigation')
export class NavigationController {
  constructor(
    private readonly getNavigationUseCase: GetNavigationUseCase,
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
    const userRole = req.user?.role || 'USER';
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
