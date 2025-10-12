import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse 
} from '@nestjs/swagger';
import { SupabaseAuthGuard } from '../../../../shared/infrastructure/guards/supabase-auth.guard';
import { CreatePostDto } from '../../application/dtos/create-post.dto';
import { UpdatePostDto } from '../../application/dtos/update-post.dto';
import { GetPostsDto } from '../../application/dtos/get-posts.dto';
import { CreatePostUseCase } from '../../application/use-cases/create-post.use-case';
import { GetPostsUseCase } from '../../application/use-cases/get-posts.use-case';
import { GetPostUseCase } from '../../application/use-cases/get-post.use-case';
import { UpdatePostUseCase } from '../../application/use-cases/update-post.use-case';
import { PublishPostUseCase } from '../../application/use-cases/publish-post.use-case';
import { UnpublishPostUseCase } from '../../application/use-cases/unpublish-post.use-case';
import { DeletePostUseCase } from '../../application/use-cases/delete-post.use-case';
import { GetMyPostsUseCase } from '../../application/use-cases/get-my-posts.use-case';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly createPostUseCase: CreatePostUseCase,
    private readonly getPostsUseCase: GetPostsUseCase,
    private readonly getPostUseCase: GetPostUseCase,
    private readonly updatePostUseCase: UpdatePostUseCase,
    private readonly publishPostUseCase: PublishPostUseCase,
    private readonly unpublishPostUseCase: UnpublishPostUseCase,
    private readonly deletePostUseCase: DeletePostUseCase,
    private readonly getMyPostsUseCase: GetMyPostsUseCase,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Obtener lista de posts',
    description: 'Obtiene una lista paginada de posts con opciones de filtrado y búsqueda'
  })
  @ApiQuery({ name: 'published', required: false, type: Boolean, description: 'Filtrar por estado de publicación' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de posts por página (default: 10)' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Desplazamiento para paginación (default: 0)' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Buscar en título, contenido o tags' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de posts obtenida exitosamente',
    schema: {
      example: {
        posts: [
          {
            id: 'post_1',
            title: 'Mi Primer Post',
            content: 'Contenido del post...',
            authorId: 'user_id',
            isPublished: true,
            tags: ['ejemplo', 'blog'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        pagination: {
          total: 1,
          limit: 10,
          offset: 0,
          hasMore: false
        }
      }
    }
  })
  async getPosts(@Query() getPostsDto: GetPostsDto) {
    return await this.getPostsUseCase.execute(getPostsDto);
  }

  @Get('my-posts')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Obtener mis posts',
    description: 'Obtiene todos los posts creados por el usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Posts del usuario obtenidos exitosamente',
    schema: {
      example: {
        posts: [
          {
            id: 'post_1',
            title: 'Mi Post Personal',
            content: 'Contenido de mi post...',
            authorId: 'user_id',
            isPublished: false,
            tags: ['personal'],
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ]
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  async getMyPosts(@Request() req: any) {
    return await this.getMyPostsUseCase.execute(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener post por ID',
    description: 'Obtiene un post específico por su ID'
  })
  @ApiParam({ name: 'id', description: 'ID del post', example: 'post_1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Post obtenido exitosamente',
    schema: {
      example: {
        post: {
          id: 'post_1',
          title: 'Título del Post',
          content: 'Contenido completo del post...',
          authorId: 'user_id',
          isPublished: true,
          tags: ['ejemplo', 'tutorial'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiNotFoundResponse({ 
    description: 'Post no encontrado',
    schema: {
      example: {
        statusCode: 404,
        message: 'Post not found',
        timestamp: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  async getPost(@Param('id') id: string) {
    return await this.getPostUseCase.execute(id);
  }

  @Post()
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Crear nuevo post',
    description: 'Crea un nuevo post de blog. El post se crea como borrador por defecto.'
  })
  @ApiBody({ type: CreatePostDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Post creado exitosamente',
    schema: {
      example: {
        message: 'Post created successfully',
        post: {
          id: 'post_new_id',
          title: 'Nuevo Post',
          content: 'Contenido del nuevo post...',
          authorId: 'user_id',
          isPublished: false,
          tags: ['nuevo', 'ejemplo'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async createPost(@Body() createPostDto: CreatePostDto, @Request() req: any) {
    return await this.createPostUseCase.execute({
      createPostDto,
      authorId: req.user.id,
    });
  }

  @Put(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Actualizar post',
    description: 'Actualiza un post existente. Solo el autor puede actualizar sus propios posts.'
  })
  @ApiParam({ name: 'id', description: 'ID del post a actualizar', example: 'post_1' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Post actualizado exitosamente',
    schema: {
      example: {
        message: 'Post updated successfully',
        post: {
          id: 'post_1',
          title: 'Título Actualizado',
          content: 'Contenido actualizado...',
          authorId: 'user_id',
          isPublished: false,
          tags: ['actualizado'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiForbiddenResponse({ description: 'No tienes permisos para actualizar este post' })
  @ApiNotFoundResponse({ description: 'Post no encontrado' })
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: any,
  ) {
    return await this.updatePostUseCase.execute({
      postId: id,
      updatePostDto,
      authorId: req.user.id,
    });
  }

  @Put(':id/publish')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Publicar post',
    description: 'Cambia el estado de un post a publicado. Solo el autor puede publicar sus propios posts.'
  })
  @ApiParam({ name: 'id', description: 'ID del post a publicar', example: 'post_1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Post publicado exitosamente',
    schema: {
      example: {
        message: 'Post published successfully',
        post: {
          id: 'post_1',
          title: 'Mi Post',
          content: 'Contenido del post...',
          authorId: 'user_id',
          isPublished: true,
          tags: ['publicado'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiForbiddenResponse({ description: 'No tienes permisos para publicar este post' })
  @ApiNotFoundResponse({ description: 'Post no encontrado' })
  @ApiBadRequestResponse({ description: 'El post ya está publicado' })
  async publishPost(@Param('id') id: string, @Request() req: any) {
    return await this.publishPostUseCase.execute({
      postId: id,
      authorId: req.user.id,
    });
  }

  @Put(':id/unpublish')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Despublicar post',
    description: 'Cambia el estado de un post a borrador. Solo el autor puede despublicar sus propios posts.'
  })
  @ApiParam({ name: 'id', description: 'ID del post a despublicar', example: 'post_1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Post despublicado exitosamente',
    schema: {
      example: {
        message: 'Post unpublished successfully',
        post: {
          id: 'post_1',
          title: 'Mi Post',
          content: 'Contenido del post...',
          authorId: 'user_id',
          isPublished: false,
          tags: ['borrador'],
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T12:00:00.000Z'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiForbiddenResponse({ description: 'No tienes permisos para despublicar este post' })
  @ApiNotFoundResponse({ description: 'Post no encontrado' })
  @ApiBadRequestResponse({ description: 'El post ya está en borrador' })
  async unpublishPost(@Param('id') id: string, @Request() req: any) {
    return await this.unpublishPostUseCase.execute({
      postId: id,
      authorId: req.user.id,
    });
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Eliminar post',
    description: 'Elimina permanentemente un post. Solo el autor puede eliminar sus propios posts.'
  })
  @ApiParam({ name: 'id', description: 'ID del post a eliminar', example: 'post_1' })
  @ApiResponse({ 
    status: 200, 
    description: 'Post eliminado exitosamente',
    schema: {
      example: {
        message: 'Post deleted successfully'
      }
    }
  })
  @ApiUnauthorizedResponse({ description: 'Token no válido o expirado' })
  @ApiForbiddenResponse({ description: 'No tienes permisos para eliminar este post' })
  @ApiNotFoundResponse({ description: 'Post no encontrado' })
  async deletePost(@Param('id') id: string, @Request() req: any) {
    return await this.deletePostUseCase.execute({
      postId: id,
      authorId: req.user.id,
    });
  }
}
