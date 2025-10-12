import { Module } from '@nestjs/common';
import { PostsController } from './infrastructure/controllers/posts.controller';
import { PostDomainService } from './domain/services/post-domain.service';
import { PostRepositoryImpl } from './infrastructure/repositories/post.repository.impl';
import { POST_REPOSITORY_TOKEN } from './domain/repositories/post.repository.token';
import { CreatePostUseCase } from './application/use-cases/create-post.use-case';
import { GetPostsUseCase } from './application/use-cases/get-posts.use-case';
import { GetPostUseCase } from './application/use-cases/get-post.use-case';
import { UpdatePostUseCase } from './application/use-cases/update-post.use-case';
import { PublishPostUseCase } from './application/use-cases/publish-post.use-case';
import { UnpublishPostUseCase } from './application/use-cases/unpublish-post.use-case';
import { DeletePostUseCase } from './application/use-cases/delete-post.use-case';
import { GetMyPostsUseCase } from './application/use-cases/get-my-posts.use-case';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PostsController],
  providers: [
    // Domain Services
    PostDomainService,
    
    // Repository Implementation (using in-memory for now)
    {
      provide: POST_REPOSITORY_TOKEN,
      useClass: PostRepositoryImpl,
    },
    
    // Use Cases
    CreatePostUseCase,
    GetPostsUseCase,
    GetPostUseCase,
    UpdatePostUseCase,
    PublishPostUseCase,
    UnpublishPostUseCase,
    DeletePostUseCase,
    GetMyPostsUseCase,
  ],
  exports: [POST_REPOSITORY_TOKEN, PostDomainService],
})
export class PostsModule {}
