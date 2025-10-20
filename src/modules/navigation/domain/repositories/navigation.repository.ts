import { NavItem } from '../entities/nav-item.entity';

export interface NavigationRepository {
  getNavItemsByRole(role: string): Promise<NavItem[]>;
  getAllNavItems(): Promise<NavItem[]>;
  getNavItemByRoute(route: string): Promise<NavItem | null>;
}
