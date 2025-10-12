import { Injectable, Inject } from '@nestjs/common';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY_TOKEN } from '../../domain/repositories/post.repository.token';
import { NotFoundException } from '../../../../shared/infrastructure/exceptions/domain.exceptions';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

@Injectable()
export class GetPostUseCase implements UseCase<string, any> {
  constructor(
    @Inject(POST_REPOSITORY_TOKEN) private readonly postRepository: PostRepository,
  ) {}

  async execute(postId: string) {
    const post = await this.postRepository.findById(postId);
    
    if (!post) {
      throw new NotFoundException('Post');
    }

    return {
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    };
  }
}
