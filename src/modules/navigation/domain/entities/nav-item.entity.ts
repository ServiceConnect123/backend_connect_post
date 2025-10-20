export interface NavItem {
  icon: string;
  name: string;
  ruta: string;
  badge?: string | number;
  children?: NavItem[];
  roles?: string[];
  active?: boolean;
}

export class NavigationItem {
  constructor(
    public readonly icon: string,
    public readonly name: string,
    public readonly ruta: string,
    public readonly badge?: string | number,
    public readonly children?: NavItem[],
    public readonly roles?: string[],
    public readonly active?: boolean
  ) {}

  static create(data: {
    icon: string;
    name: string;
    ruta: string;
    badge?: string | number;
    children?: NavItem[];
    roles?: string[];
    active?: boolean;
  }): NavigationItem {
    return new NavigationItem(
      data.icon,
      data.name,
      data.ruta,
      data.badge,
      data.children,
      data.roles,
      data.active
    );
  }

  toJSON(): NavItem {
    return {
      icon: this.icon,
      name: this.name,
      ruta: this.ruta,
      ...(this.badge && { badge: this.badge }),
      ...(this.children && { children: this.children }),
      ...(this.roles && { roles: this.roles }),
      ...(this.active !== undefined && { active: this.active })
    };
  }
}
