import { Injectable, Inject } from '@nestjs/common';
import type { PostRepository } from '../../domain/repositories/post.repository';
import { POST_REPOSITORY_TOKEN } from '../../domain/repositories/post.repository.token';
import { UseCase } from '../../../../shared/application/interfaces/use-case.interface';

@Injectable()
export class GetMyPostsUseCase implements UseCase<string, any> {
  constructor(
    @Inject(POST_REPOSITORY_TOKEN) private readonly postRepository: PostRepository,
  ) {}

  async execute(authorId: string) {
    const posts = await this.postRepository.findByAuthor(authorId);

    return {
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        authorId: post.authorId,
        isPublished: post.isPublished,
        tags: post.tags,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
    };
  }
}
