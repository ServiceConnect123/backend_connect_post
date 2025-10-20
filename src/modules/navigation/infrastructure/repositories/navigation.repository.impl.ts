import { Injectable } from '@nestjs/common';
import { NavigationRepository } from '../../domain/repositories/navigation.repository';
import { NavItem } from '../../domain/entities/nav-item.entity';

@Injectable()
export class NavigationRepositoryImpl implements NavigationRepository {
  
  private readonly navItems: NavItem[] = [
    { icon: "dashboard", name: "Dashboard", ruta: "/dashboard", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "home", name: "Inicio", ruta: "/", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "article", name: "Posts", ruta: "/posts", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "add_circle", name: "Crear Post", ruta: "/posts/create", roles: ['ADMIN', 'MODERATOR'] },
    { icon: "shopping_bag", name: "Productos", ruta: "/product", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "inventory", name: "Inventario", ruta: "/inventory", roles: ['ADMIN', 'MODERATOR'] },
    { icon: "group", name: "Usuarios", ruta: "/users", roles: ['ADMIN'] },
    { icon: "business", name: "Empresas", ruta: "/companies", roles: ['ADMIN'] },
    { icon: "location_on", name: "Ubicaciones", ruta: "/locations", roles: ['ADMIN'] },
    { icon: "person", name: "Perfil", ruta: "/profile", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "settings", name: "Configuración", ruta: "/settings", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "admin_panel_settings", name: "Panel Admin", ruta: "/admin", roles: ['ADMIN'] },
    { icon: "analytics", name: "Reportes", ruta: "/reports", roles: ['ADMIN', 'MODERATOR'] },
    { icon: "help", name: "Ayuda", ruta: "/help", roles: ['ADMIN', 'USER', 'MODERATOR'] },
    { icon: "logout", name: "Cerrar Sesión", ruta: "/logout", roles: ['ADMIN', 'USER', 'MODERATOR'] }
  ];

  async getNavItemsByRole(role: string): Promise<NavItem[]> {
    return this.navItems.filter(item => 
      !item.roles || item.roles.includes(role)
    );
  }

  async getAllNavItems(): Promise<NavItem[]> {
    return [...this.navItems];
  }

  async getNavItemByRoute(route: string): Promise<NavItem | null> {
    return this.navItems.find(item => item.ruta === route) || null;
  }
}
