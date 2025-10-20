import { Injectable, Inject } from '@nestjs/common';
import type { NavigationRepository } from '../../domain/repositories/navigation.repository';
import { NAVIGATION_REPOSITORY_TOKEN } from '../../domain/repositories/navigation.repository.token';
import { NavItem } from '../../domain/entities/nav-item.entity';

@Injectable()
export class GetNavigationUseCase {
  constructor(
    @Inject(NAVIGATION_REPOSITORY_TOKEN)
    private readonly navigationRepository: NavigationRepository,
  ) {}

  async execute(role?: string): Promise<NavItem[]> {
    if (role) {
      return await this.navigationRepository.getNavItemsByRole(role);
    }
    return await this.navigationRepository.getAllNavItems();
  }

  async getByRoute(route: string): Promise<NavItem | null> {
    return await this.navigationRepository.getNavItemByRoute(route);
  }
}
