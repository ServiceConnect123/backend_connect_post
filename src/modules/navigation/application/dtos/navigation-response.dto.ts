import { ApiProperty } from '@nestjs/swagger';

export class NavItemDto {
  @ApiProperty({
    description: 'Icono de Material Icons',
    example: 'home'
  })
  icon: string;

  @ApiProperty({
    description: 'Nombre del elemento de navegación',
    example: 'Inicio'
  })
  name: string;

  @ApiProperty({
    description: 'Ruta de navegación',
    example: '/'
  })
  ruta: string;

  @ApiProperty({
    description: 'Badge opcional para mostrar notificaciones',
    example: '5',
    required: false
  })
  badge?: string | number;

  @ApiProperty({
    description: 'Elementos hijos para navegación anidada',
    type: [NavItemDto],
    required: false
  })
  children?: NavItemDto[];

  @ApiProperty({
    description: 'Roles que pueden ver este elemento',
    example: ['ADMIN', 'USER'],
    required: false
  })
  roles?: string[];

  @ApiProperty({
    description: 'Indica si el elemento está activo',
    example: true,
    required: false
  })
  active?: boolean;
}

export class NavigationResponseDto {
  @ApiProperty({
    description: 'Mensaje de respuesta',
    example: 'Navegación obtenida exitosamente'
  })
  message: string;

  @ApiProperty({
    description: 'Items de navegación',
    type: [NavItemDto]
  })
  navItems: NavItemDto[];

  @ApiProperty({
    description: 'Rol del usuario',
    example: 'ADMIN',
    required: false
  })
  userRole?: string;
}
